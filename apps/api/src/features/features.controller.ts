import { Controller, Get } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';

@Controller('features')
export class FeaturesController {
  constructor(private readonly features: FeatureFlagsService) {}

  @Get('public')
  publicFlags() {
    return this.features.publicFlags();
  }
}
