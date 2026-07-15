import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { IsNull, Repository } from 'typeorm';
import { AccountStatus, User } from '../users/user.entity';
import { PublicUser, UsersService } from '../users/users.service';
import { AuthSession } from './auth-session.entity';
import type { AccessTokenPayload, AuthenticatedUser } from './auth.types';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AuthResult = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(AuthSession)
    private readonly sessionsRepository: Repository<AuthSession>,
  ) {}

  async register(payload: RegisterDto): Promise<AuthResult> {
    const email = payload.email.trim().toLowerCase();
    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException('An account with this email already exists.');
    }

    const user = await this.usersService.create({
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email,
      phone: payload.phone?.trim() || null,
      passwordHash: await this.hashSecret(payload.password),
    });

    return this.createSession(user);
  }

  async login(payload: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmailWithPassword(
      payload.email.trim().toLowerCase(),
    );
    const passwordValid = user
      ? await argon2.verify(user.passwordHash, payload.password)
      : false;

    if (!user || !passwordValid || user.status !== AccountStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    await this.usersService.recordLogin(user);
    return this.createSession(user);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const session = await this.getValidSession(refreshToken);
    const tokenValid = await argon2.verify(
      session.refreshTokenHash,
      refreshToken,
    );
    if (!tokenValid) throw new UnauthorizedException('Invalid session.');

    const user = session.user;
    if (user.status !== AccountStatus.ACTIVE)
      throw new UnauthorizedException('Invalid session.');

    const claimed = await this.sessionsRepository.update(
      { id: session.id, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
    if (claimed.affected !== 1) {
      throw new UnauthorizedException('Invalid session.');
    }

    const replacement = await this.createSession(user);
    await this.sessionsRepository.update(session.id, {
      replacedBySessionId: this.parseRefreshToken(replacement.refreshToken)
        .sessionId,
    });
    return replacement;
  }

  async logout(refreshToken?: string, sessionId?: string): Promise<void> {
    const id = refreshToken
      ? this.parseRefreshToken(refreshToken).sessionId
      : sessionId;
    if (!id) return;
    await this.sessionsRepository.update(
      { id, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async changePassword(
    userId: string,
    payload: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!(await argon2.verify(user.passwordHash, payload.currentPassword))) {
      throw new UnauthorizedException('Current password is incorrect.');
    }
    await this.usersService.updatePassword(
      user,
      await this.hashSecret(payload.newPassword),
    );
    await this.sessionsRepository.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async validateAccessToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        {
          secret: this.requireSecret(),
        },
      );
      const session = await this.sessionsRepository.findOne({
        where: { id: payload.sid, userId: payload.sub, revokedAt: IsNull() },
        relations: { user: true },
      });
      if (
        !session ||
        session.expiresAt <= new Date() ||
        session.user.status !== AccountStatus.ACTIVE
      ) {
        throw new UnauthorizedException('Invalid access token.');
      }
      return {
        id: payload.sub,
        email: session.user.email,
        role: session.user.role,
        sessionId: payload.sid,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired access token.');
    }
  }

  private async createSession(user: User): Promise<AuthResult> {
    const session = await this.sessionsRepository.save(
      this.sessionsRepository.create({
        userId: user.id,
        refreshTokenHash: 'pending',
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      }),
    );
    const refreshToken = `${session.id}.${randomBytes(48).toString('base64url')}`;
    session.refreshTokenHash = await this.hashSecret(refreshToken);
    await this.sessionsRepository.save(session);

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        sid: session.id,
      } satisfies AccessTokenPayload,
      { secret: this.requireSecret(), expiresIn: ACCESS_TOKEN_TTL },
    );
    return {
      user: this.usersService.toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  private async getValidSession(refreshToken: string): Promise<AuthSession> {
    const { sessionId } = this.parseRefreshToken(refreshToken);
    const session = await this.sessionsRepository
      .createQueryBuilder('session')
      .addSelect('session.refreshTokenHash')
      .leftJoinAndSelect('session.user', 'user')
      .where('session.id = :sessionId', { sessionId })
      .andWhere('session.revokedAt IS NULL')
      .getOne();
    if (!session || session.expiresAt <= new Date())
      throw new UnauthorizedException('Invalid session.');
    return session;
  }

  private parseRefreshToken(token: string): { sessionId: string } {
    const [sessionId, secret, ...extra] = token.split('.');
    if (!sessionId || !secret || extra.length)
      throw new UnauthorizedException('Invalid session.');
    return { sessionId };
  }

  private hashSecret(value: string): Promise<string> {
    return argon2.hash(value, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  private requireSecret(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
  }
}
