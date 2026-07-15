import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { AccountStatus, User, UserRole } from '../users/user.entity';

describe('AuthService', () => {
  const user = {
    id: '2cb4312d-ee01-4e11-9f35-40cd5b753579',
    firstName: 'Amina',
    lastName: 'Hassan',
    email: 'amina@example.com',
    role: UserRole.USER,
    status: AccountStatus.ACTIVE,
    emailVerified: false,
  } as User;
  let usersService: any;
  let sessionsRepository: any;
  let service: AuthService;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockImplementation(async (data) => ({ ...user, ...data })),
      toPublicUser: jest.fn().mockImplementation((value) => ({
        ...value,
        fullName: `${value.firstName} ${value.lastName}`,
        passwordHash: undefined,
      })),
      findByEmailWithPassword: jest.fn(),
      recordLogin: jest.fn(),
    };
    sessionsRepository = {
      create: jest.fn((value) => value),
      save: jest.fn().mockImplementation(async (value) => ({
        id: value.id ?? '64ea89ea-a3dc-4037-a012-7c308722ec99',
        ...value,
      })),
    };
    service = new AuthService(
      usersService,
      {
        signAsync: jest.fn().mockResolvedValue('signed-access-token'),
      } as unknown as JwtService,
      {
        getOrThrow: jest
          .fn()
          .mockReturnValue('unit-test-secret-at-least-32-characters'),
      } as unknown as ConfigService,
      sessionsRepository,
    );
  });

  it('hashes passwords during registration and does not return them', async () => {
    const result = await service.register({
      firstName: 'Amina',
      lastName: 'Hassan',
      email: user.email,
      password: 'SecurePass123!',
    });
    const persistedHash = usersService.create.mock.calls[0][0].passwordHash;
    expect(persistedHash).not.toBe('SecurePass123!');
    await expect(argon2.verify(persistedHash, 'SecurePass123!')).resolves.toBe(
      true,
    );
    expect(JSON.stringify(result.user)).not.toContain('SecurePass123!');
  });

  it('rejects duplicate registration', async () => {
    usersService.findByEmail.mockResolvedValue(user);
    await expect(
      service.register({
        firstName: 'Amina',
        lastName: 'Hassan',
        email: user.email,
        password: 'SecurePass123!',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects invalid login credentials', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(null);
    await expect(
      service.login({ email: user.email, password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
