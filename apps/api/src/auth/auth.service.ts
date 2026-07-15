import { createHash } from 'node:crypto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

export type AuthenticatedUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'guest' | 'user' | 'owner';
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
  fullName: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};

@Injectable()
export class AuthService {
  private readonly users = new Map<string, { id: string; email: string; password: string; fullName: string; role: 'guest' | 'user' | 'owner' }>();
  private readonly signingSecret = process.env.AUTH_SECRET || 'hospitality-dev-secret';

  constructor(private readonly usersService: UsersService) {
    this.users.set('guest@example.com', {
      id: 'user-demo',
      email: 'guest@example.com',
      password: 'Welcome123!',
      fullName: 'Guest User',
      role: 'user',
    });

    this.usersService.seedProfile({
      id: 'user-demo',
      email: 'guest@example.com',
      fullName: 'Guest User',
      role: 'user',
      phone: '+255712345678',
      location: 'Dar es Salaam',
      bio: 'Guest traveler using the platform.',
    });
  }

  register(payload: RegisterDto): AuthResponse {
    const normalizedEmail = payload.email.toLowerCase();

    if (this.users.has(normalizedEmail)) {
      throw new BadRequestException('An account with this email already exists.');
    }

    const user = {
      id: `user-${this.users.size + 1}`,
      email: normalizedEmail,
      password: payload.password,
      fullName: payload.fullName,
      role: 'user' as const,
    };

    this.users.set(user.email, user);
    this.usersService.seedProfile({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return this.buildAuthResponse(user);
  }

  login(payload: LoginDto): AuthResponse {
    const user = this.users.get(payload.email.toLowerCase());

    if (!user || user.password !== payload.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.buildAuthResponse(user);
  }

  validateToken(token: string): AuthenticatedUser {
    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid access token.');
    }

    const expectedSignature = createHash('sha256')
      .update(`${encodedPayload}:${this.signingSecret}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid access token.');
    }

    const decodedPayload = Buffer.from(encodedPayload, 'base64url').toString('utf8');

    try {
      const payload = JSON.parse(decodedPayload) as Partial<AuthenticatedUser> & { iat?: number };

      if (!payload.id || !payload.email || !payload.fullName || !payload.role) {
        throw new Error('Missing claims');
      }

      return {
        id: payload.id,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedException('Invalid access token.');
    }
  }

  private buildAuthResponse(user: { id: string; email: string; fullName: string; role: 'guest' | 'user' | 'owner' }) {
    return {
      accessToken: this.issueToken(user),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  private issueToken(user: { id: string; email: string; fullName: string; role: 'guest' | 'user' | 'owner' }) {
    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      iat: Date.now(),
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = createHash('sha256')
      .update(`${encodedPayload}:${this.signingSecret}`)
      .digest('hex');

    return `${encodedPayload}.${signature}`;
  }
}
