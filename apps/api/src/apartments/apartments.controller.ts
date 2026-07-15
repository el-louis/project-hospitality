// apps/api/src/apartments/apartments.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { Apartment } from './apartment.entity';
import { ApartmentsService } from './apartments.service';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  async findAll(): Promise<Apartment[]> {
    return this.apartmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Apartment> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }
    return apartment;
  }

  @Post()
  async create(@Body() apartment: Partial<Apartment>): Promise<Apartment> {
    return this.apartmentsService.create(apartment);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() apartment: Partial<Apartment>): Promise<Apartment> {
    const updatedApartment = await this.apartmentsService.update(id, apartment);
    if (!updatedApartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }
    return updatedApartment;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.apartmentsService.delete(id);
  }
}