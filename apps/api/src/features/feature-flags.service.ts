import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FEATURE_DEFAULTS,
  FEATURE_ENV_KEYS,
  FeatureName,
  PUBLIC_FEATURE_NAMES,
  PublicFeatureName,
} from './feature-flags';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly configService: ConfigService) {}

  isEnabled(feature: FeatureName): boolean {
    const configured = this.configService.get<string>(
      FEATURE_ENV_KEYS[feature],
    );
    if (configured === undefined || configured === '') {
      return FEATURE_DEFAULTS[feature];
    }
    return parseBooleanSafely(configured);
  }

  publicFlags(): Record<PublicFeatureName, boolean> {
    return Object.fromEntries(
      PUBLIC_FEATURE_NAMES.map((feature) => [feature, this.isEnabled(feature)]),
    ) as Record<PublicFeatureName, boolean>;
  }
}

export function parseBooleanSafely(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return false;
}
