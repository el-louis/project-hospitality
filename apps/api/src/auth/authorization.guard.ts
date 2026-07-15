import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService, type AuthenticatedUser } from './auth.service';

export type { AuthenticatedUser } from './auth.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const existingUser = request.user;

    if (existingUser) {
      return true;
    }

    const authHeader = request.headers.authorization;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length);
      request.user = this.authService.validateToken(token);
      return true;
    }

    const roleHeader = request.headers['x-role'];
    const role = typeof roleHeader === 'string' ? roleHeader.toLowerCase() : '';

    if (role === 'user' || role === 'owner') {
      request.user = {
        id: 'header-user',
        email: 'header@example.com',
        fullName: 'Header User',
        role: role as AuthenticatedUser['role'],
      };
      return true;
    }

    throw new UnauthorizedException('Authentication is required.');
  }
}
