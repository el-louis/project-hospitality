import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles('user', 'owner')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles('user', 'owner')
  updateProfile(@Param('id') id: string, @Body() updates: Record<string, unknown>) {
    return this.usersService.updateProfile(id, updates as any);
  }
}
