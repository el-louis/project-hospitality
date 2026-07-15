import { UnauthorizedException } from '@nestjs/common';
import { AuthorizationGuard } from './authorization.guard';

describe('AuthorizationGuard', () => {
  const contextFor = (
    headers: Record<string, string> = {},
    cookies: Record<string, string> = {},
  ) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ headers, cookies }) }),
    }) as any;

  it('does not trust x-role or x-user-id headers', async () => {
    const guard = new AuthorizationGuard({
      validateAccessToken: jest.fn(),
    } as any);
    await expect(
      guard.canActivate(contextFor({ 'x-role': 'owner', 'x-user-id': '1' })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('accepts a verified access cookie', async () => {
    const authService = {
      validateAccessToken: jest
        .fn()
        .mockResolvedValue({ id: '1', role: 'user' }),
    };
    const guard = new AuthorizationGuard(authService as any);
    await expect(
      guard.canActivate(contextFor({}, { hospitality_access: 'valid' })),
    ).resolves.toBe(true);
    expect(authService.validateAccessToken).toHaveBeenCalledWith('valid');
  });
});
