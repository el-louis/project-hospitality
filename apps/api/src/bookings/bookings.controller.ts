import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { OptionalAuthorizationGuard } from '../auth/optional-authorization.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(OptionalAuthorizationGuard)
  create(
    @Body() bookingRequest: CreateBookingDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.bookingsService.createBooking(bookingRequest, user?.id);
  }

  @Get('me')
  @UseGuards(AuthorizationGuard)
  getMyBookings(@CurrentUser() user: AuthenticatedUser) {
    return this.bookingsService.getBookingsForUser(user.id);
  }

  @Get('user/:userId')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  getUserBookings(@Param('userId') userId: string) {
    return this.bookingsService.getBookingsForUser(userId);
  }
}
