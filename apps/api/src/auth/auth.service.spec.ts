import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(new UsersService());
  });

  it('issues a token for valid credentials', () => {
    const result = service.login({ email: 'guest@example.com', password: 'Welcome123!' });

    expect(result.accessToken).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/);
    expect(result.user.email).toBe('guest@example.com');
  });

  it('rejects invalid credentials', () => {
    expect(() => service.login({ email: 'guest@example.com', password: 'wrong-password' })).toThrow(UnauthorizedException);
  });

  it('rejects duplicate registration', () => {
    service.register({ email: 'duplicate@example.com', password: 'Welcome123!', fullName: 'Guest User' });

    expect(() => service.register({ email: 'duplicate@example.com', password: 'Welcome123!', fullName: 'Guest User' })).toThrow(BadRequestException);
  });

  it('validates a previously issued access token', () => {
    const result = service.login({ email: 'guest@example.com', password: 'Welcome123!' });

    expect(() => service.validateToken(result.accessToken)).not.toThrow();
    expect(service.validateToken(result.accessToken).email).toBe('guest@example.com');
  });

  it('rejects invalid access tokens', () => {
    expect(() => service.validateToken('invalid-token')).toThrow(UnauthorizedException);
  });
});
