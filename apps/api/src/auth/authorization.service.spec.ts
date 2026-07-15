import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../users/user.entity';

describe('RolesGuard', () => {
  it('allows users with the required role', () => {
    const guard = new RolesGuard(new Reflector());
    const handler = {};
    const context = {
      getHandler: () => handler,
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            id: '1',
            email: 'owner@example.com',
            fullName: 'Owner',
            role: 'owner',
          },
        }),
      }),
    } as any;

    Reflect.defineMetadata(ROLES_KEY, [UserRole.OWNER], handler);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('blocks users without the required role', () => {
    const guard = new RolesGuard(new Reflector());
    const request = {
      user: {
        id: '1',
        email: 'guest@example.com',
        role: UserRole.USER,
        sessionId: 'session',
      },
    };
    const handler = {};
    const context = {
      getHandler: () => handler,
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    Reflect.defineMetadata(ROLES_KEY, [UserRole.OWNER], handler);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
