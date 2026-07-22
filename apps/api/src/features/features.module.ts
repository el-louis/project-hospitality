import { Global, Module } from '@nestjs/common';
import { FeatureGuard } from './feature.guard';
import { FeatureFlagsService } from './feature-flags.service';
import { FeaturesController } from './features.controller';

@Global()
@Module({
  controllers: [FeaturesController],
  providers: [FeatureFlagsService, FeatureGuard],
  exports: [FeatureFlagsService, FeatureGuard],
})
export class FeaturesModule {}
