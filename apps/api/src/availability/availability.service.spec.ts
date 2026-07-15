import { validateDateRange } from '../bookings/booking-rules';

describe('availability date rules', () => {
  it('allows adjacent half-open date ranges', () => {
    expect(
      validateDateRange(
        { startDate: '2099-10-10', endDate: '2099-10-12' },
        { rejectPastStart: true },
      ),
    ).toBe(2);
    expect(
      validateDateRange(
        { startDate: '2099-10-12', endDate: '2099-10-14' },
        { rejectPastStart: true },
      ),
    ).toBe(2);
  });
});
