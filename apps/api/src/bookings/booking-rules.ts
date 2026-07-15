import { BadRequestException } from '@nestjs/common';
import { BookingStatus } from './booking.entity';

export const ACTIVE_BOOKING_STATUSES = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
] as const;

export const BOOKING_STATUS_TRANSITIONS: Readonly<
  Record<BookingStatus, readonly BookingStatus[]>
> = {
  [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]: [
    BookingStatus.CHECKED_IN,
    BookingStatus.CANCELLED,
    BookingStatus.NO_SHOW,
  ],
  [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
  [BookingStatus.CHECKED_OUT]: [],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.NO_SHOW]: [],
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export function validateDateRange(
  range: DateRange,
  options: { rejectPastStart: boolean },
): number {
  const start = parseCalendarDate(range.startDate);
  const end = parseCalendarDate(range.endDate);
  if (end <= start) {
    throw new BadRequestException('Check-out must be after check-in.');
  }
  if (options.rejectPastStart && range.startDate < todayUtc()) {
    throw new BadRequestException('Check-in cannot be in the past.');
  }
  return Math.round((end - start) / 86_400_000);
}

export function isValidTransition(
  current: BookingStatus,
  next: BookingStatus,
): boolean {
  return BOOKING_STATUS_TRANSITIONS[current].includes(next);
}

function parseCalendarDate(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestException('Dates must use YYYY-MM-DD format.');
  }
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== value
  ) {
    throw new BadRequestException('Please provide valid calendar dates.');
  }
  return timestamp;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}
