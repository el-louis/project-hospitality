import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureFlagsService } from '../features/feature-flags.service';
import { UpdateRedMasaiProfileDto } from './dto/update-red-masai-profile.dto';
import { RedMasaiProfile } from './red-masai-profile.entity';

const PROFILE_ID = 1;

@Injectable()
export class RedMasaiService {
  constructor(
    @InjectRepository(RedMasaiProfile)
    private readonly profiles: Repository<RedMasaiProfile>,
    private readonly features: FeatureFlagsService,
  ) {}

  async getProtected(): Promise<RedMasaiProfile> {
    const profile = await this.profiles.findOneBy({ id: PROFILE_ID });
    if (!profile) throw new NotFoundException('Red Masai profile not found.');
    return profile;
  }

  async getPublic() {
    const profile = await this.getProtected();
    return {
      displayName: profile.displayName,
      tagline: profile.tagline,
      valueProposition: profile.valueProposition,
      shortDescription: profile.shortDescription,
      fullDescription: profile.fullDescription,
      phone: profile.phone,
      whatsapp: this.features.isEnabled('whatsappContact')
        ? profile.whatsapp
        : null,
      email: profile.email,
      address: profile.address,
      city: profile.city,
      region: profile.region,
      country: profile.country,
      latitude: profile.latitude,
      longitude: profile.longitude,
      logoUrl: profile.logoUrl,
      coverImageUrl: profile.coverImageUrl,
      instagramUrl: profile.instagramUrl,
      socialLinks: profile.socialLinks,
      timezone: profile.timezone,
      checkInTime: profile.checkInTime,
      checkOutTime: profile.checkOutTime,
      defaultCurrency: profile.defaultCurrency,
      bookingInstructions: profile.bookingInstructions,
      cancellationSummary: profile.cancellationSummary,
      previewNotice: this.features.isEnabled('conceptPreview')
        ? profile.previewNotice
        : null,
    };
  }

  async update(updates: UpdateRedMasaiProfileDto): Promise<RedMasaiProfile> {
    const profile = await this.getProtected();
    Object.assign(profile, normalizeProfileUpdate(updates));
    return this.profiles.save(profile);
  }
}

function normalizeProfileUpdate(updates: UpdateRedMasaiProfileDto) {
  return {
    ...updates,
    ...(updates.defaultCurrency
      ? { defaultCurrency: updates.defaultCurrency.toUpperCase() }
      : {}),
  };
}
