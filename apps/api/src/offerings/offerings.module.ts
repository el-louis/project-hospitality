import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Offering } from './offering.entity';
import { OfferingsController } from './offerings.controller';
import { OfferingsService } from './offerings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offering]), AuthModule],
  controllers: [OfferingsController],
  providers: [OfferingsService],
})
export class OfferingsModule {}
