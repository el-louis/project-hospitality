import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from '../apartments/apartment.entity';
import { AuthModule } from '../auth/auth.module';
import { Booking } from '../bookings/booking.entity';
import { AvailabilityBlock } from './availability-block.entity';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailabilityBlock, Booking, Apartment]),
    AuthModule,
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
