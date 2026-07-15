import { BadRequestException, Injectable } from '@nestjs/common';

export type AvailabilityRange = {
  apartmentId: string;
  startDate: string;
  endDate: string;
  blocked: boolean;
  reason?: string;
};

@Injectable()
export class AvailabilityService {
  private readonly ranges = new Map<string, AvailabilityRange[]>();

  getAvailability(apartmentId: string): AvailabilityRange[] {
    return this.ranges.get(apartmentId) ?? [];
  }

  blockDates(
    apartmentId: string,
    range: Omit<AvailabilityRange, 'apartmentId'>,
  ) {
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      throw new BadRequestException('Please provide a valid range of dates.');
    }

    const current = this.ranges.get(apartmentId) ?? [];
    const updated = [...current, { apartmentId, ...range }];
    this.ranges.set(apartmentId, updated);
    return updated;
  }

  isAvailable(
    apartmentId: string,
    startDate: string,
    endDate: string,
  ): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      throw new BadRequestException('Please provide a valid range of dates.');
    }

    const blockedRanges = this.getAvailability(apartmentId);
    return !blockedRanges.some((range) => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      return start < rangeEnd && end > rangeStart;
    });
  }
}
