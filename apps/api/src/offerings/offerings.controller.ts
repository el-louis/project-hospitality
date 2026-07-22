import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FeatureGuard } from '../features/feature.guard';
import { RequireFeature } from '../features/require-feature.decorator';
import { UserRole } from '../users/user.entity';
import { CreateOfferingDto, UpdateOfferingDto } from './dto/offering.dto';
import { OfferingQueryDto } from './dto/offering-query.dto';
import { OfferingsService } from './offerings.service';

@Controller('offerings')
export class OfferingsController {
  constructor(private readonly offerings: OfferingsService) {}

  @Get()
  @UseGuards(FeatureGuard)
  @RequireFeature('publicWebsite')
  findPublic(@Query() query: OfferingQueryDto) {
    return this.offerings.findPublic(query.category);
  }

  @Get('manage')
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('contentManagement')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  findAllProtected() {
    return this.offerings.findAllProtected();
  }

  @Get(':slug')
  @UseGuards(FeatureGuard)
  @RequireFeature('publicWebsite')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.offerings.findPublicBySlug(slug);
  }

  @Post()
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('contentManagement')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@Body() payload: CreateOfferingDto) {
    return this.offerings.create(payload);
  }

  @Patch(':id')
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('contentManagement')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: UpdateOfferingDto,
  ) {
    return this.offerings.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(FeatureGuard, AuthorizationGuard, RolesGuard)
  @RequireFeature('contentManagement')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  deactivate(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.offerings.deactivate(id);
  }
}
