import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Apartment } from '../src/apartments/apartment.entity';
import { AvailabilityBlock } from '../src/availability/availability-block.entity';
import { Booking, BookingStatus } from '../src/bookings/booking.entity';
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
  let bookingsRepository: Repository<Booking>;
  let dataSource: DataSource;
  let apartment: Apartment;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();
    usersRepository = moduleFixture.get(getRepositoryToken(User));
    bookingsRepository = moduleFixture.get(getRepositoryToken(Booking));
    dataSource = moduleFixture.get(DataSource);
    apartment = await dataSource.getRepository(Apartment).save(
      dataSource.getRepository(Apartment).create({
        title: 'Persisted Garden Studio',
        description: 'Test apartment',
        pricePerNight: 150,
        maxGuests: 4,
        bedrooms: 1,
        bathrooms: 1,
        hasKitchen: true,
        hasWiFi: true,
        hasParking: true,
        location: 'Test location',
        status: 'available',
      }),
    );
    activeApartmentId = apartment.id;
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
      .post(`/availability/${apartment.id}/blocks`)
      .send({ startDate: '2099-08-10', endDate: '2099-08-12' })
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
        apartmentId: apartment.id,
        fullName: 'Amina Hassan',
        email: credentials.email,
        phone: '+255712345678',
        checkIn: '2099-09-10',
        checkOut: '2099-09-12',
        guests: 2,
      })
      .expect(201);
    const history = await agent.get('/bookings/me').expect(200);
    expect(history.body).toHaveLength(1);
    await agent.get('/bookings').expect(403);
  });

  it('persists bookings with unique references and verified user association', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/auth/login').send(loginPayload()).expect(200);
    const first = await agent
      .post('/bookings')
      .send(bookingPayload('2099-10-01', '2099-10-03'))
      .expect(201);
    const second = await agent
      .post('/bookings')
      .send(bookingPayload('2099-10-03', '2099-10-05'))
      .expect(201);

    expect(first.body.reference).toMatch(/^RM-\d{8}-[A-F0-9]{12}$/);
    expect(first.body.reference).not.toBe(second.body.reference);
    expect(first.body).toMatchObject({
      totalAmount: 300,
      currency: 'USD',
      status: BookingStatus.PENDING,
    });
    expect(JSON.stringify(first.body)).not.toMatch(
      /email|phone|notes|userId|guestFirstName|guestLastName/i,
    );

    const persisted = await bookingsRepository.findOneByOrFail({
      reference: first.body.reference as string,
    });
    const user = await usersRepository.findOneByOrFail({
      email: credentials.email,
    });
    expect(persisted.userId).toBe(user.id);
    expect(persisted.totalAmount).toBe(300);

    await request(app.getHttpServer())
      .get(`/bookings/reference/${first.body.reference}`)
      .expect(401);
    const ownerLookup = await agent
      .get(`/bookings/reference/${first.body.reference}`)
      .expect(200);
    expect(ownerLookup.body.apartment).toEqual({
      title: apartment.title,
    });
    expect(JSON.stringify(ownerLookup.body)).not.toMatch(
      /email|phone|notes|userId|guestFirstName|guestLastName|"id"/i,
    );

    const otherUser = request.agent(app.getHttpServer());
    await otherUser
      .post('/auth/register')
      .send({
        firstName: 'Other',
        lastName: 'Guest',
        email: 'other-guest@example.com',
        password: 'OtherSecurePass123!',
      })
      .expect(201);
    await otherUser
      .get(`/bookings/reference/${first.body.reference}`)
      .expect(404);
    await otherUser
      .post(`/bookings/${first.body.reference}/cancel`)
      .send({})
      .expect(403);
    await request(app.getHttpServer())
      .post(`/bookings/${first.body.reference}/cancel`)
      .send({})
      .expect(401);
  });

  it('creates anonymous bookings without exposing them in user history', async () => {
    const anonymous = await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-10-06', '2099-10-08'))
      .expect(201);
    const persisted = await bookingsRepository.findOneByOrFail({
      reference: anonymous.body.reference as string,
    });
    expect(persisted.userId).toBeNull();

    const agent = request.agent(app.getHttpServer());
    await agent.post('/auth/login').send(loginPayload()).expect(200);
    const history = await agent.get('/bookings/me').expect(200);
    expect(
      history.body.some(
        (booking: { reference: string }) =>
          booking.reference === anonymous.body.reference,
      ),
    ).toBe(false);
  });

  it('rejects invalid and past date ranges', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-10-10', '2099-10-10'))
      .expect(400);
    await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2020-01-01', '2020-01-02'))
      .expect(400);
  });

  it('rejects overlap while allowing same-day turnover', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-10-10', '2099-10-12'))
      .expect(201);
    await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-10-11', '2099-10-13'))
      .expect(409);
    await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-10-12', '2099-10-14'))
      .expect(201);
  });

  it('serializes concurrent requests so only one overlapping booking succeeds', async () => {
    const responses = await Promise.all([
      request(app.getHttpServer())
        .post('/bookings')
        .send(bookingPayload('2099-10-20', '2099-10-22')),
      request(app.getHttpServer())
        .post('/bookings')
        .send(bookingPayload('2099-10-20', '2099-10-22')),
    ]);
    expect(responses.map((response) => response.status).sort()).toEqual([
      201, 409,
    ]);
  });

  it('releases dates after an authenticated owner cancels their booking', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/auth/login').send(loginPayload()).expect(200);
    const created = await agent
      .post('/bookings')
      .send(bookingPayload('2099-11-01', '2099-11-03'))
      .expect(201);
    await agent
      .post(`/bookings/${created.body.reference}/cancel`)
      .send({})
      .expect(201);
    await agent
      .post(`/bookings/${created.body.reference}/cancel`)
      .send({})
      .expect(409);
    await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-11-01', '2099-11-03'))
      .expect(201);
  });

  it('enforces manual blocks, staff authorization, and block removal', async () => {
    await request(app.getHttpServer())
      .post(`/availability/${apartment.id}/blocks`)
      .send({ startDate: '2099-11-10', endDate: '2099-11-12' })
      .expect(401);

    const user = await usersRepository.findOneByOrFail({
      email: credentials.email,
    });
    user.role = UserRole.OWNER;
    await usersRepository.save(user);
    const owner = request.agent(app.getHttpServer());
    await owner.post('/auth/login').send(loginPayload()).expect(200);
    const block = await owner
      .post(`/availability/${apartment.id}/blocks`)
      .send({
        startDate: '2099-11-10',
        endDate: '2099-11-12',
        reason: 'Maintenance',
      })
      .expect(201);
    await owner
      .post(`/availability/${apartment.id}/blocks`)
      .send({ startDate: '2099-11-11', endDate: '2099-11-13' })
      .expect(409);
    await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-11-10', '2099-11-11'))
      .expect(409);
    await owner
      .delete(`/availability/${apartment.id}/blocks/${block.body.id}`)
      .expect(204);
    await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-11-10', '2099-11-11'))
      .expect(201);
    user.role = UserRole.USER;
    await usersRepository.save(user);
  });

  it('enforces valid staff status transitions and privacy-safe listing', async () => {
    const created = await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-12-01', '2099-12-03'))
      .expect(201);
    const user = await usersRepository.findOneByOrFail({
      email: credentials.email,
    });
    user.role = UserRole.ADMIN;
    await usersRepository.save(user);
    const admin = request.agent(app.getHttpServer());
    await admin.post('/auth/login').send(loginPayload()).expect(200);
    await admin
      .patch(`/bookings/${created.body.reference}/status`)
      .send({ status: BookingStatus.CONFIRMED })
      .expect(200);
    await admin
      .patch(`/bookings/${created.body.reference}/status`)
      .send({ status: BookingStatus.CHECKED_IN })
      .expect(200);
    await admin
      .patch(`/bookings/${created.body.reference}/status`)
      .send({ status: BookingStatus.PENDING })
      .expect(409);
    const listing = await admin.get('/bookings').expect(200);
    expect(listing.body.length).toBeGreaterThan(0);
    expect(JSON.stringify(listing.body)).not.toMatch(
      /email|phone|notes|userId|guestFirstName|guestLastName|"id"/i,
    );
    const staffCancellation = await request(app.getHttpServer())
      .post('/bookings')
      .send(bookingPayload('2099-12-04', '2099-12-06'))
      .expect(201);
    await admin
      .post(`/bookings/${staffCancellation.body.reference}/cancel`)
      .send({})
      .expect(201);
    user.role = UserRole.USER;
    await usersRepository.save(user);
  });

  it('runs against the isolated pg-mem booking schema without Neon configuration', async () => {
    expect(dataSource.options.database).not.toBe(process.env.DB_NAME);
    expect(dataSource.getMetadata(Booking).tableName).toBe('bookings');
    expect(dataSource.getMetadata(AvailabilityBlock).tableName).toBe(
      'availability_blocks',
    );
    expect(await bookingsRepository.count()).toBeGreaterThan(0);
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

function loginPayload() {
  return { email: credentials.email, password: credentials.password };
}

function bookingPayload(checkIn: string, checkOut: string) {
  return {
    apartmentId: apartmentIdForPayload(),
    fullName: 'Amina Hassan',
    email: credentials.email,
    phone: '+255712345678',
    checkIn,
    checkOut,
    guests: 2,
    notes: 'Test-only note',
  };
}

let activeApartmentId = '';
function apartmentIdForPayload(): string {
  return activeApartmentId;
}
