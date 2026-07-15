import { BadRequestException } from '@nestjs/common';
import { AvailabilityService } from '../availability/availability.service';
import { BookingsService } from './bookings.service';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(() => {
    service = new BookingsService(new AvailabilityService());
  });

  it('creates a confirmation for a valid booking request', () => {
    const response = service.createBooking({
      fullName: 'Amina Hassan',
      email: 'amina@example.com',
      phone: '+255712345678',
      checkIn: '2026-08-10',
      checkOut: '2026-08-13',
      guests: 2,
      apartmentPreference: 'Studio Garden View',
      notes: 'Late arrival',
    });

    expect(response).toEqual(
      expect.objectContaining({
        message: expect.stringContaining('booking request'),
        reference: expect.stringMatching(/^RM-/),
        estimatedTotal: 450,
      }),
    );
  });

  it('rejects a checkout date that is not after the check-in date', () => {
    expect(() =>
      service.createBooking({
        fullName: 'Amina Hassan',
        email: 'amina@example.com',
        phone: '+255712345678',
        checkIn: '2026-08-13',
        checkOut: '2026-08-10',
        guests: 2,
      }),
    ).toThrow(BadRequestException);
  });

  it('stores a booking with the user id when provided', () => {
    const response = service.createBooking(
      {
        fullName: 'Amina Hassan',
        email: 'amina@example.com',
        phone: '+255712345678',
        checkIn: '2026-08-10',
        checkOut: '2026-08-13',
        guests: 2,
      },
      'user-demo',
    );

    expect(response.userId).toBe('user-demo');
  });

  it('returns bookings belonging to a specific user', () => {
    service.createBooking(
      {
        fullName: 'Amina Hassan',
        email: 'amina@example.com',
        phone: '+255712345678',
        checkIn: '2026-08-10',
        checkOut: '2026-08-13',
        guests: 2,
      },
      'user-demo',
    );

    expect(service.getBookingsForUser('user-demo')).toHaveLength(1);
  });
});
