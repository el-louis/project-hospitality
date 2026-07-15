import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

export class CreateBookingDto {
  @IsUUID()
  apartmentId: string;

  @IsString()
  @Length(1, 200)
  fullName: string;

  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsString()
  @Length(5, 30)
  phone: string;

  @Matches(CALENDAR_DATE)
  checkIn: string;

  @Matches(CALENDAR_DATE)
  checkOut: string;

  @IsInt()
  @Min(1)
  @Max(100)
  guests: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
