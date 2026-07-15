import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Apartment } from './apartments/apartment.entity';
import { User } from './users/user.entity';
import { AuthSession } from './auth/auth-session.entity';
import { ApartmentsModule } from './apartments/apartments.module';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingsModule } from './bookings/bookings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (environment: Record<string, unknown>) => {
        if (
          typeof environment.JWT_ACCESS_SECRET !== 'string' ||
          environment.JWT_ACCESS_SECRET.length < 32
        ) {
          throw new Error(
            'JWT_ACCESS_SECRET must be configured with at least 32 characters.',
          );
        }
        return environment;
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Apartment, User, AuthSession],
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
      migrationsRun: false,
      synchronize: false,
      ssl:
        process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    ApartmentsModule,
    AuthModule,
    AvailabilityModule,
    BookingsModule,
    UsersModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
