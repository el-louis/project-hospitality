import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Booking } from '../bookings/booking.entity';
import { FeatureGuard } from '../features/feature.guard';
import { RequireFeature } from '../features/require-feature.decorator';
import { UserRole } from '../users/user.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Booking)
    private readonly bookings: Repository<Booking>,
  ) {}

  @Get('summary')
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('staffDashboard')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async summary() {
    return { bookingCount: await this.bookings.count() };
  }
}
