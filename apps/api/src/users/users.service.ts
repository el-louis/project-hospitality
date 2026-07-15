import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';

export type PublicUser = Omit<
  User,
  'passwordHash' | 'sessions' | 'bookings' | 'availabilityBlocks'
> & {
  fullName: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    data: Pick<
      User,
      'firstName' | 'lastName' | 'email' | 'phone' | 'passwordHash'
    >,
  ): Promise<User> {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User profile not found.');
    return user;
  }

  async findByIdWithPassword(id: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new NotFoundException('User profile not found.');
    return user;
  }

  async updateProfile(
    id: string,
    updates: UpdateProfileDto,
  ): Promise<PublicUser> {
    const user = await this.findById(id);
    Object.assign(user, updates);
    return this.toPublicUser(await this.usersRepository.save(user));
  }

  async updatePassword(user: User, passwordHash: string): Promise<void> {
    user.passwordHash = passwordHash;
    await this.usersRepository.save(user);
  }

  async recordLogin(user: User): Promise<void> {
    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);
  }

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
