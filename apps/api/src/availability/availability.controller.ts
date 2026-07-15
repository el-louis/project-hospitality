import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AvailabilityService, type AvailabilityRange } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get(':apartmentId')
  getAvailability(@Param('apartmentId') apartmentId: string) {
    return this.availabilityService.getAvailability(apartmentId);
  }

  @Post(':apartmentId')
  blockDates(@Param('apartmentId') apartmentId: string, @Body() payload: Omit<AvailabilityRange, 'apartmentId'>) {
    return this.availabilityService.blockDates(apartmentId, payload);
  }
}
