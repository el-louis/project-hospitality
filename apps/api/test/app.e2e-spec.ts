import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { Repository } from 'typeorm';
import { User, UserRole } from '../src/users/user.entity';
import { TestAppModule } from './test-app.module';

const credentials = {
  firstName: 'Amina',
  lastName: 'Hassan',
  email: 'amina@example.com',
  password: 'SecurePass123!',
};

describe('Secure authentication foundation (e2e)', () => {
  let app: INestApplication<App> | undefined;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();
    usersRepository = moduleFixture.get(getRepositoryToken(User));
    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('registers a user, hashes the password, and never returns password data', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);
    expect(response.body.user).toMatchObject({
      email: credentials.email,
      firstName: 'Amina',
      role: UserRole.USER,
    });
    expect(JSON.stringify(response.body)).not.toMatch(/password/i);
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('HttpOnly')]),
    );

    const persisted = await usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: credentials.email })
      .getOneOrFail();
    expect(persisted.passwordHash).not.toBe(credentials.password);
    await expect(
      argon2.verify(persisted.passwordHash, credentials.password),
    ).resolves.toBe(true);
  });

  it('rejects duplicate email registration', () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(409));

  it('logs in with valid credentials and rejects invalid credentials generically', async () => {
    const valid = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    expect(valid.body.user.email).toBe(credentials.email);
    expect(JSON.stringify(valid.body)).not.toMatch(/password|token/i);
    const invalid = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: 'wrong' })
      .expect(401);
    expect(invalid.body.message).toBe('Invalid email or password.');
  });

  it('requires verified authentication and rejects header bypasses and invalid tokens', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('x-role', 'owner')
      .set('x-user-id', 'someone-else')
      .expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid')
      .expect(401);

    const expired = await new JwtService().signAsync(
      {
        sub: '00000000-0000-0000-0000-000000000000',
        email: 'expired@example.com',
        role: 'user',
        sid: '00000000-0000-0000-0000-000000000001',
      },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: -1 },
    );
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${expired}`)
      .expect(401);
  });

  it('allows a valid user to access and update only their own safe profile fields', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    await agent.get('/auth/me').expect(200);
    const updated = await agent
      .patch('/users/me')
      .send({ firstName: 'Amira', phone: '+255700000000' })
      .expect(200);
    expect(updated.body).toMatchObject({
      firstName: 'Amira',
      phone: '+255700000000',
      role: UserRole.USER,
    });
    await agent.patch('/users/me').send({ role: UserRole.ADMIN }).expect(400);
    await agent.get('/users/00000000-0000-0000-0000-000000000000').expect(404);
  });

  it('rotates refresh tokens and rejects replay of the previous token', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    const oldRefresh = extractCookie(
      login.headers['set-cookie'],
      'hospitality_refresh',
    );
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: oldRefresh })
      .expect(200);
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: oldRefresh })
      .expect(401);
  });

  it('revokes the active session on logout', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    const access = extractCookie(
      login.headers['set-cookie'],
      'hospitality_access',
    );
    const refreshCookie = cookieHeader(
      login.headers['set-cookie'],
      'hospitality_refresh',
    );
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', refreshCookie)
      .expect(204);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${access}`)
      .expect(401);
  });

  it('protects apartment and availability mutations from ordinary users and spoofed headers', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    await agent.post('/apartments').send(apartmentPayload()).expect(403);
    await agent
      .post('/availability/apt-1')
      .send({ startDate: '2026-08-10', endDate: '2026-08-12', blocked: true })
      .expect(403);
    await request(app.getHttpServer())
      .post('/apartments')
      .set('x-role', 'owner')
      .send(apartmentPayload())
      .expect(401);
  });

  it('allows an owner to mutate apartments while preserving public reads', async () => {
    const user = await usersRepository.findOneByOrFail({
      email: credentials.email,
    });
    user.role = UserRole.OWNER;
    await usersRepository.save(user);
    const owner = request.agent(app.getHttpServer());
    await owner
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    await owner.post('/apartments').send(apartmentPayload()).expect(201);
    await request(app.getHttpServer()).get('/apartments').expect(200);
    user.role = UserRole.USER;
    await usersRepository.save(user);
  });

  it('enforces booking-history ownership', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    await agent
      .post('/bookings')
      .send({
        fullName: 'Amina Hassan',
        email: credentials.email,
        phone: '+255712345678',
        checkIn: '2026-09-10',
        checkOut: '2026-09-12',
        guests: 2,
      })
      .expect(201);
    const history = await agent.get('/bookings/me').expect(200);
    expect(history.body).toHaveLength(1);
    await agent
      .get('/bookings/user/00000000-0000-0000-0000-000000000000')
      .expect(403);
  });
});

function extractCookie(
  setCookies: string | string[] | undefined,
  name: string,
): string {
  const cookie = normalizeCookies(setCookies).find((value) =>
    value.startsWith(`${name}=`),
  );
  if (!cookie) throw new Error(`Missing ${name} cookie`);
  return decodeURIComponent(cookie.split(';')[0].slice(name.length + 1));
}

function cookieHeader(
  setCookies: string | string[] | undefined,
  name: string,
): string {
  const cookie = normalizeCookies(setCookies).find((value) =>
    value.startsWith(`${name}=`),
  );
  if (!cookie) throw new Error(`Missing ${name} cookie`);
  return cookie.split(';')[0];
}

function normalizeCookies(setCookies: string | string[] | undefined): string[] {
  if (!setCookies) return [];
  return Array.isArray(setCookies) ? setCookies : [setCookies];
}

function apartmentPayload() {
  return {
    title: 'Garden Studio',
    description: 'Quiet studio',
    pricePerNight: 150,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hasKitchen: true,
    hasWiFi: true,
    hasParking: true,
    location: 'Dar es Salaam',
  };
}
