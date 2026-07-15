import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorizationGuard } from './authorization.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService, AuthorizationGuard, RolesGuard],
  exports: [AuthService, AuthorizationGuard, RolesGuard],
})
export class AuthModule {}
