import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO4217CurrencyCode,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ContentConfidence } from '../../red-masai/content-confidence';
import { OfferingBookingMethod, OfferingCategory } from '../offering.entity';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateOfferingDto {
  @IsEnum(OfferingCategory) category: OfferingCategory;
  @Matches(SLUG) @Length(1, 100) slug: string;
  @IsString() @Length(1, 160) title: string;
  @IsString() @Length(1, 1000) shortSummary: string;
  @IsString() @Length(1, 10000) fullDescription: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) startingPrice?:
    number | null;
  @IsISO4217CurrencyCode() currency: string;
  @IsOptional() @IsString() @MaxLength(1000) pricingNote?: string | null;
  @IsOptional() @IsInt() @Min(1) @Max(10000) capacity?: number | null;
  @IsOptional() @IsString() @MaxLength(500) durationNote?: string | null;
  @IsArray()
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  includedItems: string[];
  @IsOptional() @IsString() @MaxLength(1000) additionalChargeNote?:
    string | null;
  @IsEnum(OfferingBookingMethod) bookingMethod: OfferingBookingMethod;
  @IsBoolean() whatsappAction: boolean;
  @IsOptional() @IsUrl({ require_protocol: true }) imageUrl?: string | null;
  @IsBoolean() active: boolean;
  @IsBoolean() featured: boolean;
  @IsInt() @Min(0) @Max(10000) displayOrder: number;
  @IsEnum(ContentConfidence) contentConfidence: ContentConfidence;
}

export class UpdateOfferingDto {
  @IsOptional() @IsEnum(OfferingCategory) category?: OfferingCategory;
  @IsOptional() @Matches(SLUG) @Length(1, 100) slug?: string;
  @IsOptional() @IsString() @Length(1, 160) title?: string;
  @IsOptional() @IsString() @Length(1, 1000) shortSummary?: string;
  @IsOptional() @IsString() @Length(1, 10000) fullDescription?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) startingPrice?:
    number | null;
  @IsOptional() @IsISO4217CurrencyCode() currency?: string;
  @IsOptional() @IsString() @MaxLength(1000) pricingNote?: string | null;
  @IsOptional() @IsInt() @Min(1) @Max(10000) capacity?: number | null;
  @IsOptional() @IsString() @MaxLength(500) durationNote?: string | null;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  includedItems?: string[];
  @IsOptional() @IsString() @MaxLength(1000) additionalChargeNote?:
    string | null;
  @IsOptional()
  @IsEnum(OfferingBookingMethod)
  bookingMethod?: OfferingBookingMethod;
  @IsOptional() @IsBoolean() whatsappAction?: boolean;
  @IsOptional() @IsUrl({ require_protocol: true }) imageUrl?: string | null;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() @Min(0) @Max(10000) displayOrder?: number;
  @IsOptional()
  @IsEnum(ContentConfidence)
  contentConfidence?: ContentConfidence;
}
