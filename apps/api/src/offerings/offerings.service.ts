import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferingDto, UpdateOfferingDto } from './dto/offering.dto';
import { Offering, OfferingCategory } from './offering.entity';

@Injectable()
export class OfferingsService {
  constructor(
    @InjectRepository(Offering)
    private readonly offerings: Repository<Offering>,
  ) {}

  async findPublic(category?: OfferingCategory) {
    const offerings = await this.offerings.find({
      where: { active: true, ...(category ? { category } : {}) },
      order: { displayOrder: 'ASC', title: 'ASC' },
    });
    return offerings.map(toPublicOffering);
  }

  async findPublicBySlug(slug: string) {
    const offering = await this.offerings.findOneBy({ slug, active: true });
    if (!offering) throw new NotFoundException('Offering not found.');
    return toPublicOffering(offering);
  }

  findAllProtected(): Promise<Offering[]> {
    return this.offerings.find({
      order: { displayOrder: 'ASC', title: 'ASC' },
    });
  }

  create(payload: CreateOfferingDto): Promise<Offering> {
    return this.offerings.save(
      this.offerings.create(normalizeOffering(payload)),
    );
  }

  async update(id: string, payload: UpdateOfferingDto): Promise<Offering> {
    const offering = await this.offerings.findOneBy({ id });
    if (!offering) throw new NotFoundException('Offering not found.');
    Object.assign(offering, normalizeOffering(payload));
    return this.offerings.save(offering);
  }

  async deactivate(id: string): Promise<Offering> {
    return this.update(id, { active: false });
  }
}

function normalizeOffering<T extends CreateOfferingDto | UpdateOfferingDto>(
  payload: T,
) {
  return {
    ...payload,
    ...(payload.currency ? { currency: payload.currency.toUpperCase() } : {}),
  };
}

function toPublicOffering(offering: Offering) {
  return {
    category: offering.category,
    slug: offering.slug,
    title: offering.title,
    shortSummary: offering.shortSummary,
    fullDescription: offering.fullDescription,
    startingPrice: offering.startingPrice,
    currency: offering.currency,
    pricingNote: offering.pricingNote,
    capacity: offering.capacity,
    durationNote: offering.durationNote,
    includedItems: offering.includedItems,
    additionalChargeNote: offering.additionalChargeNote,
    bookingMethod: offering.bookingMethod,
    whatsappAction: offering.whatsappAction,
    imageUrl: offering.imageUrl,
    featured: offering.featured,
    displayOrder: offering.displayOrder,
  };
}
