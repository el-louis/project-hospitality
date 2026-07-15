import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataType, newDb } from 'pg-mem';
import type { DataSourceOptions } from 'typeorm';
import { Apartment } from '../src/apartments/apartment.entity';
import { ApartmentsModule } from '../src/apartments/apartments.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { AuthModule } from '../src/auth/auth.module';
import { AvailabilityModule } from '../src/availability/availability.module';
import { BookingsModule } from '../src/bookings/bookings.module';
import { UsersModule } from '../src/users/users.module';

const database = newDb();
database.public.registerFunction({
  name: 'version',
  returns: DataType.text,
  implementation: () => 'PostgreSQL 16.0',
});
database.public.registerFunction({
  name: 'current_database',
  returns: DataType.text,
  implementation: () => 'hospitality_e2e',
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        entities: [Apartment],
        synchronize: false,
        retryAttempts: 1,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = database.adapters.createTypeormDataSource(options as DataSourceOptions);
        return dataSource.initialize();
      },
    }),
    ApartmentsModule,
    AuthModule,
    AvailabilityModule,
    BookingsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule {}
