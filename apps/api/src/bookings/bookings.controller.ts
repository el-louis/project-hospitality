import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { OptionalAuthorizationGuard } from '../auth/optional-authorization.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

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

  @Get('reference/:reference')
  @UseGuards(AuthorizationGuard)
  getByReference(
    @Param('reference') reference: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookingsService.getBookingByReference(reference, user);
  }

  @Get()
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  listBookings() {
    return this.bookingsService.listBookings();
  }

  @Patch(':reference/status')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateStatus(
    @Param('reference') reference: string,
    @Body() payload: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(reference, payload.status);
  }

  @Post(':reference/cancel')
  @UseGuards(AuthorizationGuard)
  cancel(
    @Param('reference') reference: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookingsService.cancelBooking(reference, user);
  }
}
