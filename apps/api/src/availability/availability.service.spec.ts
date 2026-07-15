import { BadRequestException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

describe('AvailabilityService', () => {
  let service: AvailabilityService;

  beforeEach(() => {
    service = new AvailabilityService();
  });

  it('blocks a valid range of dates', () => {
    const result = service.blockDates('apt-1', {
      startDate: '2026-08-10',
      endDate: '2026-08-14',
      blocked: true,
      reason: 'Maintenance',
    });

    expect(result).toHaveLength(1);
  });

  it('returns false when the requested range overlaps a blocked period', () => {
    service.blockDates('apt-1', {
      startDate: '2026-08-10',
      endDate: '2026-08-14',
      blocked: true,
    });

    expect(service.isAvailable('apt-1', '2026-08-12', '2026-08-15')).toBe(
      false,
    );
  });

  it('rejects an invalid date range', () => {
    expect(() =>
      service.isAvailable('apt-1', '2026-08-20', '2026-08-10'),
    ).toThrow(BadRequestException);
  });
});
