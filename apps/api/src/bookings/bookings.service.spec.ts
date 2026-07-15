import { BadRequestException } from '@nestjs/common';
import {
  BOOKING_STATUS_TRANSITIONS,
  isValidTransition,
  validateDateRange,
} from './booking-rules';
import { BookingStatus } from './booking.entity';

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
