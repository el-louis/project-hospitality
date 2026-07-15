import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { BlockAvailabilityDto } from './dto/block-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get(':apartmentId')
  getAvailability(@Param('apartmentId') apartmentId: string) {
    return this.availabilityService.getAvailability(apartmentId);
  }

  @Post(':apartmentId')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  blockDates(
    @Param('apartmentId') apartmentId: string,
    @Body() payload: BlockAvailabilityDto,
  ) {
    return this.availabilityService.blockDates(apartmentId, payload);
  }
}
