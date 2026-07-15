import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './auth.types';

export type AuthenticatedRequest = Omit<Request, 'cookies'> & {
  user?: AuthenticatedUser;
  cookies?: Record<string, string>;
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const bearerToken =
      typeof authorization === 'string' && authorization.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length)
        : undefined;
    const token = request.cookies?.hospitality_access ?? bearerToken;
    if (!token) throw new UnauthorizedException('Authentication is required.');
    request.user = await this.authService.validateAccessToken(token);
    return true;
  }
}
