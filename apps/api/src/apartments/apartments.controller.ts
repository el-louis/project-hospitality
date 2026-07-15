// apps/api/src/apartments/apartments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { Apartment } from './apartment.entity';
import { ApartmentsService } from './apartments.service';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import {
  CreateApartmentDto,
  UpdateApartmentDto,
} from './dto/apartment-mutation.dto';

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
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async create(@Body() apartment: CreateApartmentDto): Promise<Apartment> {
    return this.apartmentsService.create(apartment);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() apartment: UpdateApartmentDto,
  ): Promise<Apartment> {
    const updatedApartment = await this.apartmentsService.update(id, apartment);
    if (!updatedApartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }
    return updatedApartment;
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.apartmentsService.delete(id);
  }
}
