import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import type { AuthenticatedUser } from './auth.types';
import { AuthorizationGuard } from './authorization.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { FeatureGuard } from '../features/feature.guard';
import { RequireFeature } from '../features/require-feature.decorator';

type CookieRequest = Omit<Request, 'cookies'> & {
  cookies?: Record<string, string>;
};

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @UseGuards(FeatureGuard)
  @RequireFeature('guestAccounts')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(
    @Body() payload: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.completeAuthentication(
      await this.authService.register(payload),
      response,
    );
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.completeAuthentication(
      await this.authService.login(payload),
      response,
    );
  }

  @Post('refresh')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async refresh(
    @Body() payload: RefreshTokenDto,
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies?.hospitality_refresh ?? payload.refreshToken;
    if (!token) return this.authService.refresh('');
    return this.completeAuthentication(
      await this.authService.refresh(token),
      response,
    );
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(request.cookies?.hospitality_refresh);
    this.clearCookies(response);
  }

  @Get('me')
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthenticatedUser) {
    return { user };
  }

  @Post('change-password')
  @HttpCode(204)
  @UseGuards(AuthorizationGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.changePassword(user.id, payload);
    this.clearCookies(response);
  }

  private completeAuthentication(
    result: Awaited<ReturnType<AuthService['login']>>,
    response: Response,
  ) {
    const secure =
      this.configService.get('NODE_ENV') === 'production' ||
      this.configService.get('COOKIE_SECURE') === 'true';
    const common = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure,
      path: '/',
    };
    response.cookie('hospitality_access', result.accessToken, {
      ...common,
      maxAge: ACCESS_MAX_AGE,
    });
    response.cookie('hospitality_refresh', result.refreshToken, {
      ...common,
      maxAge: REFRESH_MAX_AGE,
      path: '/auth',
    });
    return { user: result.user };
  }

  private clearCookies(response: Response): void {
    response.clearCookie('hospitality_access', { path: '/' });
    response.clearCookie('hospitality_refresh', { path: '/auth' });
  }
}
