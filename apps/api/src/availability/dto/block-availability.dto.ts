import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

export class BlockAvailabilityDto {
  @Matches(CALENDAR_DATE)
  startDate: string;

  @Matches(CALENDAR_DATE)
  endDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
