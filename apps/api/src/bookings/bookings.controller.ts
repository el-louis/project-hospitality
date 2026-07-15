import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import type { AuthenticatedUser } from '../auth/authorization.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BookingsService, type BookingRequest } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() bookingRequest: BookingRequest, @Req() request: Request & { user?: AuthenticatedUser }) {
    const userId = request.user?.id;
    return this.bookingsService.createBooking(bookingRequest, userId);
  }

  @Get(':userId')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles('user', 'owner')
  getUserBookings(@Param('userId') userId: string) {
    return this.bookingsService.getBookingsForUser(userId);
  }
}
