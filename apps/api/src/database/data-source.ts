import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Apartment } from '../apartments/apartment.entity';
import { AuthSession } from '../auth/auth-session.entity';
import { User } from '../users/user.entity';
import { AvailabilityBlock } from '../availability/availability-block.entity';
import { Booking } from '../bookings/booking.entity';
import { RedMasaiProfile } from '../red-masai/red-masai-profile.entity';
import { Offering } from '../offerings/offering.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [
    Apartment,
    User,
    AuthSession,
    Booking,
    AvailabilityBlock,
    RedMasaiProfile,
    Offering,
  ],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  synchronize: false,
});
