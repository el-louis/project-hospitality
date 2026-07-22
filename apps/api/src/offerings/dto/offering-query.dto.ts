import { IsEnum, IsOptional } from 'class-validator';
import { OfferingCategory } from '../offering.entity';

export class OfferingQueryDto {
  @IsOptional()
  @IsEnum(OfferingCategory)
  category?: OfferingCategory;
}
