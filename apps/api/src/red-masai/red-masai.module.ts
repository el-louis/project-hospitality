import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RedMasaiController } from './red-masai.controller';
import { RedMasaiProfile } from './red-masai-profile.entity';
import { RedMasaiService } from './red-masai.service';

@Module({
  imports: [TypeOrmModule.forFeature([RedMasaiProfile]), AuthModule],
  controllers: [RedMasaiController],
  providers: [RedMasaiService],
  exports: [RedMasaiService],
})
export class RedMasaiModule {}
