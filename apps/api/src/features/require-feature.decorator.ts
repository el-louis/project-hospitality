import { SetMetadata } from '@nestjs/common';
import type { FeatureName } from './feature-flags';

export const REQUIRED_FEATURE_KEY = 'requiredFeature';
export const RequireFeature = (feature: FeatureName) =>
  SetMetadata(REQUIRED_FEATURE_KEY, feature);
