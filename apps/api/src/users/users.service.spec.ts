import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  it('returns a seeded user profile', () => {
    expect(service.getProfile('user-demo')).toEqual(
      expect.objectContaining({
        id: 'user-demo',
        email: 'guest@example.com',
      }),
    );
  });

  it('updates an existing profile', () => {
    const updated = service.updateProfile('user-demo', { location: 'Arusha' });

    expect(updated.location).toBe('Arusha');
  });

  it('throws when a profile does not exist', () => {
    expect(() => service.getProfile('missing')).toThrow(NotFoundException);
  });
});
