import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class BlockAvailabilityDto {
  @IsDateString() startDate: string;
  @IsDateString() endDate: string;
  @IsBoolean() blocked: boolean;
  @IsOptional() @IsString() @MaxLength(500) reason?: string;
}
