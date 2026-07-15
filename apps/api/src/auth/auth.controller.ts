import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, type LoginDto, type RegisterDto } from './auth.service';
import { AuthorizationGuard, type AuthenticatedUser } from './authorization.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Get('me')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles('user', 'owner')
  me(@Req() request: Request & { user?: AuthenticatedUser }) {
    return { user: request.user };
  }
}
