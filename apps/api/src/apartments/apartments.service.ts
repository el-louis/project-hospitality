// apps/api/src/apartments/apartments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from './apartment.entity';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,
  ) {}

  async findAll(): Promise<Apartment[]> {
    return this.apartmentsRepository.find();
  }

  async findOne(id: string): Promise<Apartment | null> {  // <-- Update return type
    return this.apartmentsRepository.findOne({ where: { id } });
  }

  async create(apartment: Partial<Apartment>): Promise<Apartment> {
    return this.apartmentsRepository.save(apartment);
  }

  async update(id: string, apartment: Partial<Apartment>): Promise<Apartment | null> {  // <-- Update return type
    await this.apartmentsRepository.update(id, apartment);
    return this.apartmentsRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.apartmentsRepository.delete(id);
  }
}