import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateApartmentDto {
  @IsString() @Length(1, 150) title: string;
  @IsString() @Length(1, 5000) description: string;
  @IsInt() @Min(0) pricePerNight: number;
  @IsInt() @Min(1) @Max(100) maxGuests: number;
  @IsInt() @Min(0) @Max(50) bedrooms: number;
  @IsInt() @Min(0) @Max(50) bathrooms: number;
  @IsBoolean() hasKitchen: boolean;
  @IsBoolean() hasWiFi: boolean;
  @IsBoolean() hasParking: boolean;
  @IsString() @Length(1, 255) location: string;
  @IsOptional() @IsIn(['available', 'unavailable']) status?: string;
}

export class UpdateApartmentDto {
  @IsOptional() @IsString() @Length(1, 150) title?: string;
  @IsOptional() @IsString() @Length(1, 5000) description?: string;
  @IsOptional() @IsInt() @Min(0) pricePerNight?: number;
  @IsOptional() @IsInt() @Min(1) @Max(100) maxGuests?: number;
  @IsOptional() @IsInt() @Min(0) @Max(50) bedrooms?: number;
  @IsOptional() @IsInt() @Min(0) @Max(50) bathrooms?: number;
  @IsOptional() @IsBoolean() hasKitchen?: boolean;
  @IsOptional() @IsBoolean() hasWiFi?: boolean;
  @IsOptional() @IsBoolean() hasParking?: boolean;
  @IsOptional() @IsString() @Length(1, 255) location?: string;
  @IsOptional() @IsIn(['available', 'unavailable']) status?: string;
}
