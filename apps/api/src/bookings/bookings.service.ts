import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, In, LessThan, MoreThan } from 'typeorm';
import { Apartment } from '../apartments/apartment.entity';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AvailabilityBlock } from '../availability/availability-block.entity';
import { UserRole } from '../users/user.entity';
import {
  ACTIVE_BOOKING_STATUSES,
  isValidTransition,
  validateDateRange,
} from './booking-rules';
import { Booking, BookingStatus } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

export type BookingSummary = {
  reference: string;
  apartment: { title: string };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  createdAt: Date;
};

@Injectable()
export class BookingsService {
  constructor(private readonly dataSource: DataSource) {}

  async createBooking(
    request: CreateBookingDto,
    userId?: string,
  ): Promise<{
    message: string;
    reference: string;
    totalAmount: number;
    currency: string;
    status: BookingStatus;
  }> {
    const nights = validateDateRange(
      { startDate: request.checkIn, endDate: request.checkOut },
      { rejectPastStart: true },
    );

    const booking = await this.dataSource.transaction(async (manager) => {
      const apartment = await this.lockApartment(manager, request.apartmentId);
      if (request.guests > apartment.maxGuests) {
        throw new BadRequestException(
          'Guest count exceeds this apartment capacity.',
        );
      }
      await this.assertAvailable(
        manager,
        apartment.id,
        request.checkIn,
        request.checkOut,
      );

      const names = splitGuestName(request.fullName);
      const totalAmount = nights * apartment.pricePerNight;
      return manager.getRepository(Booking).save(
        manager.getRepository(Booking).create({
          reference: createBookingReference(),
          apartmentId: apartment.id,
          userId: userId ?? null,
          guestFirstName: names.firstName,
          guestLastName: names.lastName,
          guestEmail: request.email.trim().toLowerCase(),
          guestPhone: request.phone.trim(),
          checkIn: request.checkIn,
          checkOut: request.checkOut,
          guestCount: request.guests,
          nightlyRateSnapshot: apartment.pricePerNight,
          totalAmount,
          currency: 'USD',
          status: BookingStatus.PENDING,
          guestNotes: request.notes?.trim() || null,
          internalNotes: null,
        }),
      );
    });

    return {
      message:
        'Your booking request has been received. We will contact you shortly.',
      reference: booking.reference,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      status: booking.status,
    };
  }

  async getBookingsForUser(userId: string): Promise<BookingSummary[]> {
    const bookings = await this.dataSource.getRepository(Booking).find({
      where: { userId },
      relations: { apartment: true },
      order: { createdAt: 'DESC' },
    });
    return bookings.map(toSummary);
  }

  async getBookingByReference(
    reference: string,
    activeUser: AuthenticatedUser,
  ): Promise<BookingSummary> {
    const booking = await this.findByReference(reference);
    if (!isStaff(activeUser) && booking.userId !== activeUser.id) {
      throw new NotFoundException('Booking not found.');
    }
    return toSummary(booking);
  }

  async listBookings(): Promise<BookingSummary[]> {
    const bookings = await this.dataSource.getRepository(Booking).find({
      relations: { apartment: true },
      order: { createdAt: 'DESC' },
    });
    return bookings.map(toSummary);
  }

  async updateStatus(
    reference: string,
    nextStatus: BookingStatus,
  ): Promise<BookingSummary> {
    return this.changeStatus(reference, nextStatus);
  }

  async cancelBooking(
    reference: string,
    activeUser: AuthenticatedUser,
  ): Promise<BookingSummary> {
    return this.changeStatus(reference, BookingStatus.CANCELLED, activeUser);
  }

  private async changeStatus(
    reference: string,
    nextStatus: BookingStatus,
    activeUser?: AuthenticatedUser,
  ): Promise<BookingSummary> {
    return this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({
        where: { reference },
        lock: { mode: 'pessimistic_write' },
      });
      if (!booking) throw new NotFoundException('Booking not found.');
      if (
        activeUser &&
        !isStaff(activeUser) &&
        booking.userId !== activeUser.id
      ) {
        throw new ForbiddenException('You cannot cancel this booking.');
      }
      if (!isValidTransition(booking.status, nextStatus)) {
        throw new ConflictException(
          `Booking cannot transition from ${booking.status} to ${nextStatus}.`,
        );
      }
      booking.apartment = await this.lockApartment(
        manager,
        booking.apartmentId,
      );
      booking.status = nextStatus;
      return toSummary(await manager.getRepository(Booking).save(booking));
    });
  }

  private async findByReference(reference: string): Promise<Booking> {
    const booking = await this.dataSource.getRepository(Booking).findOne({
      where: { reference },
      relations: { apartment: true },
    });
    if (!booking) throw new NotFoundException('Booking not found.');
    return booking;
  }

  private async lockApartment(
    manager: EntityManager,
    apartmentId: string,
  ): Promise<Apartment> {
    const apartment = await manager.getRepository(Apartment).findOne({
      where: { id: apartmentId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!apartment) throw new NotFoundException('Apartment not found.');
    return apartment;
  }

  private async assertAvailable(
    manager: EntityManager,
    apartmentId: string,
    checkIn: string,
    checkOut: string,
  ): Promise<void> {
    const [bookingOverlap, blockOverlap] = await Promise.all([
      manager.getRepository(Booking).exists({
        where: {
          apartmentId,
          status: In([...ACTIVE_BOOKING_STATUSES]),
          checkIn: LessThan(checkOut),
          checkOut: MoreThan(checkIn),
        },
      }),
      manager.getRepository(AvailabilityBlock).exists({
        where: {
          apartmentId,
          startDate: LessThan(checkOut),
          endDate: MoreThan(checkIn),
        },
      }),
    ]);
    if (bookingOverlap || blockOverlap) {
      throw new ConflictException(
        'The selected dates are not available for this apartment.',
      );
    }
  }
}

function createBookingReference(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `RM-${date}-${randomBytes(6).toString('hex').toUpperCase()}`;
}

function splitGuestName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const [firstName, ...remaining] = fullName.trim().split(/\s+/);
  return { firstName, lastName: remaining.join(' ') };
}

function isStaff(user: AuthenticatedUser): boolean {
  return user.role === UserRole.OWNER || user.role === UserRole.ADMIN;
}

function toSummary(booking: Booking): BookingSummary {
  return {
    reference: booking.reference,
    apartment: {
      title: booking.apartment.title,
    },
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guestCount,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}
