import { BadRequestException, Injectable } from '@nestjs/common';
import { AvailabilityService } from '../availability/availability.service';
import type { BookingRecord } from './booking.entity';

export type BookingRequest = {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  apartmentPreference?: string;
  notes?: string;
};

@Injectable()
export class BookingsService {
  private readonly bookings = new Map<string, BookingRecord>();

  constructor(private readonly availabilityService: AvailabilityService) {}

  createBooking(request: BookingRequest, userId?: string) {
    const checkIn = new Date(request.checkIn);
    const checkOut = new Date(request.checkOut);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      throw new BadRequestException('Please provide valid check-in and check-out dates.');
    }

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in.');
    }

    const apartmentId = request.apartmentPreference ?? 'default-apartment';
    const isAvailable = this.availabilityService.isAvailable(apartmentId, request.checkIn, request.checkOut);

    if (!isAvailable) {
      throw new BadRequestException('The selected dates are not available for this apartment.');
    }

    const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const nightlyRate = 150;
    const estimatedTotal = nights * nightlyRate;

    const booking: BookingRecord = {
      id: `booking-${this.bookings.size + 1}`,
      reference: `RM-${Date.now().toString().slice(-6)}`,
      userId,
      fullName: request.fullName,
      email: request.email,
      phone: request.phone,
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      guests: request.guests,
      apartmentPreference: request.apartmentPreference,
      notes: request.notes,
      estimatedTotal,
      status: 'pending',
    };

    this.bookings.set(booking.reference, booking);

    return {
      message: 'Your booking request has been received. We will contact you shortly.',
      reference: booking.reference,
      estimatedTotal,
      request,
      userId,
    };
  }

  getBookingsForUser(userId: string): BookingRecord[] {
    return Array.from(this.bookings.values()).filter((booking) => booking.userId === userId);
  }
}
