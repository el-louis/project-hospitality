import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FeatureGuard } from '../features/feature.guard';
import { RequireFeature } from '../features/require-feature.decorator';
import { UserRole } from '../users/user.entity';
import { UpdateRedMasaiProfileDto } from './dto/update-red-masai-profile.dto';
import { RedMasaiService } from './red-masai.service';

@Controller('red-masai')
export class RedMasaiController {
  constructor(private readonly redMasai: RedMasaiService) {}

  @Get('public')
  @UseGuards(FeatureGuard)
  @RequireFeature('publicWebsite')
  getPublic() {
    return this.redMasai.getPublic();
  }

  @Get()
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('contentManagement')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  getProtected() {
    return this.redMasai.getProtected();
  }

  @Patch()
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('contentManagement')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  update(@Body() updates: UpdateRedMasaiProfileDto) {
    return this.redMasai.update(updates);
  }
}
