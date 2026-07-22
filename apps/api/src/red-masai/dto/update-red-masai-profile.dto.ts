import {
  IsEmail,
  IsISO4217CurrencyCode,
  IsLatitude,
  IsLongitude,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ContentConfidence } from '../content-confidence';

@ValidatorConstraint({ name: 'ianaTimezone', async: false })
class IsIanaTimezone implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: value });
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'timezone must be a valid IANA timezone';
  }
}

@ValidatorConstraint({ name: 'publicSocialLinks', async: false })
class ArePublicSocialLinks implements ValidatorConstraintInterface {
  validate(value: Record<string, unknown>): boolean {
    if (!value || Array.isArray(value) || typeof value !== 'object')
      return false;
    return Object.values(value).every((link) => {
      if (typeof link !== 'string') return false;
      try {
        return ['http:', 'https:'].includes(new URL(link).protocol);
      } catch {
        return false;
      }
    });
  }

  defaultMessage(): string {
    return 'every social link must be an absolute HTTP or HTTPS URL';
  }
}

@ValidatorConstraint({ name: 'profileConfidenceMap', async: false })
class IsProfileConfidenceMap implements ValidatorConstraintInterface {
  validate(value: Record<string, unknown>): boolean {
    if (!value || Array.isArray(value) || typeof value !== 'object')
      return false;
    return Object.values(value).every((status) =>
      Object.values(ContentConfidence).includes(status as ContentConfidence),
    );
  }

  defaultMessage(): string {
    return 'fieldConfidence values must be valid content confidence states';
  }
}

const optionalUrl = () => IsUrl({ require_protocol: true });
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export class UpdateRedMasaiProfileDto {
  @IsOptional() @IsString() @Length(1, 160) displayName?: string;
  @IsOptional() @IsString() @Length(1, 200) tagline?: string;
  @IsOptional() @IsString() @Length(1, 240) valueProposition?: string;
  @IsOptional() @IsString() @Length(1, 1000) shortDescription?: string;
  @IsOptional() @IsString() @Length(1, 10000) fullDescription?: string;
  @IsOptional() @IsPhoneNumber(null) phone?: string | null;
  @IsOptional() @IsPhoneNumber(null) whatsapp?: string | null;
  @IsOptional() @IsEmail() @MaxLength(320) email?: string | null;
  @IsOptional() @IsString() @MaxLength(1000) address?: string | null;
  @IsOptional() @IsString() @Length(1, 120) city?: string;
  @IsOptional() @IsString() @Length(1, 120) region?: string;
  @IsOptional() @IsString() @Length(1, 120) country?: string;
  @IsOptional() @IsLatitude() latitude?: number | null;
  @IsOptional() @IsLongitude() longitude?: number | null;
  @IsOptional() @optionalUrl() logoUrl?: string | null;
  @IsOptional() @optionalUrl() coverImageUrl?: string | null;
  @IsOptional() @optionalUrl() instagramUrl?: string | null;
  @IsOptional()
  @IsObject()
  @Validate(ArePublicSocialLinks)
  socialLinks?: Record<string, string>;
  @IsOptional() @IsString() @Validate(IsIanaTimezone) timezone?: string;
  @IsOptional() @Matches(TIME) checkInTime?: string | null;
  @IsOptional() @Matches(TIME) checkOutTime?: string | null;
  @IsOptional() @IsISO4217CurrencyCode() defaultCurrency?: string;
  @IsOptional() @IsString() @MaxLength(5000) bookingInstructions?:
    string | null;
  @IsOptional() @IsString() @MaxLength(5000) cancellationSummary?:
    string | null;
  @IsOptional() @IsString() @Length(1, 1000) previewNotice?: string;

  @IsOptional()
  @IsObject()
  @Validate(IsProfileConfidenceMap)
  fieldConfidence?: Record<string, ContentConfidence>;
}
