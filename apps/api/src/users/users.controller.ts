import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthorizationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() activeUser: AuthenticatedUser) {
    return this.usersService.toPublicUser(
      await this.usersService.findById(activeUser.id),
    );
  }

  @Patch('me')
  updateProfile(
    @CurrentUser() activeUser: AuthenticatedUser,
    @Body() updates: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(activeUser.id, updates);
  }
}
