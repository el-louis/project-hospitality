import { ConfigService } from '@nestjs/config';
import { FEATURE_NAMES } from './feature-flags';
import {
  FeatureFlagsService,
  parseBooleanSafely,
} from './feature-flags.service';

describe('FeatureFlagsService', () => {
  it('defaults every future capability to disabled', () => {
    const service = new FeatureFlagsService({ get: jest.fn() } as any);
    for (const feature of [
      'payments',
      'mobileMoney',
      'multiBusiness',
      'businessOnboarding',
      'businessSwitching',
      'restaurantModule',
      'recreationModule',
      'eventVenueModule',
      'reviews',
      'advancedAnalytics',
      'customDomains',
      'staffInvitations',
    ] as const) {
      expect(service.isEnabled(feature)).toBe(false);
    }
    expect(FEATURE_NAMES).toHaveLength(22);
  });

  it('fails safely for malformed boolean values', () => {
    expect(parseBooleanSafely('TRUE')).toBe(true);
    expect(parseBooleanSafely('false')).toBe(false);
    expect(parseBooleanSafely('yes')).toBe(false);
    expect(parseBooleanSafely(1)).toBe(false);
  });

  it('exposes only the approved public flags', () => {
    const service = new FeatureFlagsService({
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService);
    expect(service.publicFlags()).toEqual({
      conceptPreview: true,
      publicWebsite: true,
      onlineBooking: true,
      guestAccounts: true,
      guestBookingHistory: true,
      whatsappContact: true,
    });
    expect(service.publicFlags()).not.toHaveProperty('contentManagement');
    expect(service.publicFlags()).not.toHaveProperty('payments');
  });
});
