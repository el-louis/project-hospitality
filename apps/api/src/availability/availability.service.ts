import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, In, LessThan, MoreThan } from 'typeorm';
import { Apartment } from '../apartments/apartment.entity';
import {
  ACTIVE_BOOKING_STATUSES,
  validateDateRange,
} from '../bookings/booking-rules';
import { Booking } from '../bookings/booking.entity';
import { AvailabilityBlock } from './availability-block.entity';
import { BlockAvailabilityDto } from './dto/block-availability.dto';

export type AvailabilityRange = {
  id?: string;
  source: 'booking' | 'manual';
  startDate: string;
  endDate: string;
  reason?: string;
};

@Injectable()
export class AvailabilityService {
  constructor(private readonly dataSource: DataSource) {}

  async getAvailability(apartmentId: string): Promise<AvailabilityRange[]> {
    await this.requireApartment(apartmentId);
    const [bookings, blocks] = await Promise.all([
      this.dataSource.getRepository(Booking).find({
        where: {
          apartmentId,
          status: In([...ACTIVE_BOOKING_STATUSES]),
        },
        order: { checkIn: 'ASC' },
      }),
      this.dataSource.getRepository(AvailabilityBlock).find({
        where: { apartmentId },
        order: { startDate: 'ASC' },
      }),
    ]);
    return [
      ...bookings.map((booking) => ({
        source: 'booking' as const,
        startDate: booking.checkIn,
        endDate: booking.checkOut,
      })),
      ...blocks.map((block) => ({
        id: block.id,
        source: 'manual' as const,
        startDate: block.startDate,
        endDate: block.endDate,
        ...(block.reason ? { reason: block.reason } : {}),
      })),
    ].sort((left, right) => left.startDate.localeCompare(right.startDate));
  }

  async blockDates(
    apartmentId: string,
    range: BlockAvailabilityDto,
    createdByUserId: string,
  ): Promise<AvailabilityRange> {
    validateDateRange(
      { startDate: range.startDate, endDate: range.endDate },
      { rejectPastStart: true },
    );
    const block = await this.dataSource.transaction(async (manager) => {
      await this.lockApartment(manager, apartmentId);
      const [bookingOverlap, blockOverlap] = await Promise.all([
        manager.getRepository(Booking).exists({
          where: {
            apartmentId,
            status: In([...ACTIVE_BOOKING_STATUSES]),
            checkIn: LessThan(range.endDate),
            checkOut: MoreThan(range.startDate),
          },
        }),
        manager.getRepository(AvailabilityBlock).exists({
          where: {
            apartmentId,
            startDate: LessThan(range.endDate),
            endDate: MoreThan(range.startDate),
          },
        }),
      ]);
      if (bookingOverlap || blockOverlap) {
        throw new ConflictException(
          'The selected dates already contain a booking or manual block.',
        );
      }
      return manager.getRepository(AvailabilityBlock).save(
        manager.getRepository(AvailabilityBlock).create({
          apartmentId,
          startDate: range.startDate,
          endDate: range.endDate,
          reason: range.reason?.trim() || null,
          createdByUserId,
        }),
      );
    });
    return {
      id: block.id,
      source: 'manual',
      startDate: block.startDate,
      endDate: block.endDate,
      ...(block.reason ? { reason: block.reason } : {}),
    };
  }

  async removeBlock(apartmentId: string, blockId: string): Promise<void> {
    const result = await this.dataSource
      .getRepository(AvailabilityBlock)
      .delete({
        id: blockId,
        apartmentId,
      });
    if (result.affected !== 1) {
      throw new NotFoundException('Availability block not found.');
    }
  }

  private async requireApartment(apartmentId: string): Promise<void> {
    if (
      !(await this.dataSource
        .getRepository(Apartment)
        .existsBy({ id: apartmentId }))
    ) {
      throw new NotFoundException('Apartment not found.');
    }
  }

  private async lockApartment(
    manager: EntityManager,
    apartmentId: string,
  ): Promise<void> {
    const apartment = await manager.getRepository(Apartment).findOne({
      where: { id: apartmentId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!apartment) throw new NotFoundException('Apartment not found.');
  }
}
