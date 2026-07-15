import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthSession } from './auth-session.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorizationGuard } from './authorization.guard';
import { RolesGuard } from './roles.guard';
import { OptionalAuthorizationGuard } from './optional-authorization.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([AuthSession]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthorizationGuard,
    OptionalAuthorizationGuard,
    RolesGuard,
  ],
  exports: [
    AuthService,
    AuthorizationGuard,
    OptionalAuthorizationGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
