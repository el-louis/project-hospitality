import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString() @Length(1, 200) fullName: string;
  @IsEmail() @MaxLength(320) email: string;
  @IsString() @Length(5, 30) phone: string;
  @IsDateString() checkIn: string;
  @IsDateString() checkOut: string;
  @IsInt() @Min(1) @Max(100) guests: number;
  @IsOptional() @IsString() @MaxLength(255) apartmentPreference?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
}
