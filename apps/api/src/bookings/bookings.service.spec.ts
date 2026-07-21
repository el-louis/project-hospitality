import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import type { DataSource, EntityManager } from 'typeorm';
import { Apartment } from '../apartments/apartment.entity';
import { UserRole } from '../users/user.entity';
import {
  BOOKING_STATUS_TRANSITIONS,
  isValidTransition,
  validateDateRange,
} from './booking-rules';
import { Booking, BookingStatus } from './booking.entity';
import { BookingsService } from './bookings.service';

describe('booking rules', () => {
  it('uses half-open ranges that permit same-day turnover', () => {
    expect(
      validateDateRange(
        { startDate: '2099-08-10', endDate: '2099-08-13' },
        { rejectPastStart: true },
      ),
    ).toBe(3);
    expect(
      validateDateRange(
        { startDate: '2099-08-13', endDate: '2099-08-14' },
        { rejectPastStart: true },
      ),
    ).toBe(1);
  });

  it.each([
    ['2099-08-13', '2099-08-13'],
    ['2099-08-14', '2099-08-13'],
    ['not-a-date', '2099-08-13'],
  ])('rejects invalid range %s to %s', (startDate, endDate) => {
    expect(() =>
      validateDateRange({ startDate, endDate }, { rejectPastStart: true }),
    ).toThrow(BadRequestException);
  });

  it('rejects past check-in dates', () => {
    expect(() =>
      validateDateRange(
        { startDate: '2020-01-01', endDate: '2020-01-02' },
        { rejectPastStart: true },
      ),
    ).toThrow('Check-in cannot be in the past.');
  });

  it('enforces the documented lifecycle transition table', () => {
    expect(
      isValidTransition(BookingStatus.PENDING, BookingStatus.CONFIRMED),
    ).toBe(true);
    expect(
      isValidTransition(BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN),
    ).toBe(true);
    expect(
      isValidTransition(BookingStatus.CHECKED_OUT, BookingStatus.PENDING),
    ).toBe(false);
    expect(
      isValidTransition(BookingStatus.CANCELLED, BookingStatus.CHECKED_IN),
    ).toBe(false);
    expect(BOOKING_STATUS_TRANSITIONS[BookingStatus.NO_SHOW]).toEqual([]);
  });
});

describe('BookingsService PostgreSQL-safe status locking', () => {
  it('locks the booking without relations, authorizes its owner, then loads the apartment separately', async () => {
    const harness = createStatusHarness();

    const result = await harness.service.cancelBooking('RM-TEST', {
      id: 'user-1',
      email: 'owner@example.test',
      role: UserRole.USER,
      sessionId: 'session-1',
    });

    expect(result.status).toBe(BookingStatus.CANCELLED);
    expect(harness.bookingRepository.findOne).toHaveBeenCalledWith({
      where: { reference: 'RM-TEST' },
      lock: { mode: 'pessimistic_write' },
    });
    expect(
      harness.bookingRepository.findOne.mock.calls[0][0],
    ).not.toHaveProperty('relations');
    expect(harness.apartmentRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'apartment-1' },
      lock: { mode: 'pessimistic_write' },
    });
    expect(harness.bookingRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: BookingStatus.CANCELLED }),
    );
    expect(
      harness.bookingRepository.findOne.mock.invocationCallOrder[0],
    ).toBeLessThan(
      harness.apartmentRepository.findOne.mock.invocationCallOrder[0],
    );
    expect(
      harness.apartmentRepository.findOne.mock.invocationCallOrder[0],
    ).toBeLessThan(harness.bookingRepository.save.mock.invocationCallOrder[0]);
  });

  it('allows authorized staff cancellation through the same safe path', async () => {
    const harness = createStatusHarness();
    await expect(
      harness.service.cancelBooking('RM-TEST', {
        id: 'admin-1',
        email: 'admin@example.test',
        role: UserRole.ADMIN,
        sessionId: 'session-1',
      }),
    ).resolves.toMatchObject({ status: BookingStatus.CANCELLED });
  });

  it('rejects unauthorized cancellation before loading the apartment or saving', async () => {
    const harness = createStatusHarness();
    await expect(
      harness.service.cancelBooking('RM-TEST', {
        id: 'user-2',
        email: 'other@example.test',
        role: UserRole.USER,
        sessionId: 'session-2',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(harness.apartmentRepository.findOne).not.toHaveBeenCalled();
    expect(harness.bookingRepository.save).not.toHaveBeenCalled();
  });

  it('rejects repeated cancellation while the locked booking is cancelled', async () => {
    const harness = createStatusHarness(BookingStatus.CANCELLED);
    await expect(
      harness.service.cancelBooking('RM-TEST', {
        id: 'user-1',
        email: 'owner@example.test',
        role: UserRole.USER,
        sessionId: 'session-1',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(harness.bookingRepository.save).not.toHaveBeenCalled();
  });

  it('uses the same relation-free lock for generic staff status changes', async () => {
    const harness = createStatusHarness();
    await expect(
      harness.service.updateStatus('RM-TEST', BookingStatus.CONFIRMED),
    ).resolves.toMatchObject({ status: BookingStatus.CONFIRMED });
    expect(harness.bookingRepository.findOne).toHaveBeenCalledWith({
      where: { reference: 'RM-TEST' },
      lock: { mode: 'pessimistic_write' },
    });
  });
});

function createStatusHarness(status = BookingStatus.PENDING) {
  const apartment = {
    id: 'apartment-1',
    title: 'Test apartment',
  } as Apartment;
  const booking = {
    id: 'booking-1',
    reference: 'RM-TEST',
    apartmentId: apartment.id,
    userId: 'user-1',
    checkIn: '2099-01-01',
    checkOut: '2099-01-03',
    guestCount: 2,
    totalAmount: 300,
    currency: 'USD',
    status,
    createdAt: new Date('2098-01-01T00:00:00Z'),
  } as Booking;
  const bookingRepository = {
    findOne: jest.fn().mockResolvedValue(booking),
    save: jest.fn(async (value: Booking) => value),
  };
  const apartmentRepository = {
    findOne: jest.fn().mockResolvedValue(apartment),
  };
  const manager = {
    getRepository: jest.fn((entity: typeof Booking | typeof Apartment) =>
      entity === Booking ? bookingRepository : apartmentRepository,
    ),
  } as unknown as EntityManager;
  const dataSource = {
    transaction: jest.fn(
      (callback: (transactionManager: EntityManager) => Promise<unknown>) =>
        callback(manager),
    ),
    getRepository: jest.fn(),
  } as unknown as DataSource;

  return {
    service: new BookingsService(dataSource),
    bookingRepository,
    apartmentRepository,
  };
}
