import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';
import { AvailabilityService } from './availability.service';
import { BlockAvailabilityDto } from './dto/block-availability.dto';
import { FeatureGuard } from '../features/feature.guard';
import { RequireFeature } from '../features/require-feature.decorator';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get(':apartmentId')
  getAvailability(
    @Param('apartmentId', new ParseUUIDPipe()) apartmentId: string,
  ) {
    return this.availabilityService.getAvailability(apartmentId);
  }

  @Post(':apartmentId/blocks')
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('availabilityManagement')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  blockDates(
    @Param('apartmentId', new ParseUUIDPipe()) apartmentId: string,
    @Body() payload: BlockAvailabilityDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.availabilityService.blockDates(apartmentId, payload, user.id);
  }

  @Delete(':apartmentId/blocks/:blockId')
  @HttpCode(204)
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('availabilityManagement')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  removeBlock(
    @Param('apartmentId', new ParseUUIDPipe()) apartmentId: string,
    @Param('blockId', new ParseUUIDPipe()) blockId: string,
  ) {
    return this.availabilityService.removeBlock(apartmentId, blockId);
  }
}
