import { UsersService } from './users.service';
import { AccountStatus, User, UserRole } from './user.entity';

describe('UsersService', () => {
  it('removes password hashes from public user responses', () => {
    const service = new UsersService({} as any);
    const result = service.toPublicUser({
      id: '1',
      firstName: 'Amina',
      lastName: 'Hassan',
      email: 'amina@example.com',
      passwordHash: 'secret-hash',
      role: UserRole.USER,
      status: AccountStatus.ACTIVE,
      emailVerified: false,
      sessions: [],
    } as User);
    expect(result.fullName).toBe('Amina Hassan');
    expect(result).not.toHaveProperty('passwordHash');
  });
});
