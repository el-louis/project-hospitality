import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  pricePerNight: number;

  @Column('int')
  maxGuests: number;

  @Column('int')
  bedrooms: number;

  @Column('int')
  bathrooms: number;

  @Column({ default: false })
  hasKitchen: boolean;

  @Column({ default: false })
  hasWiFi: boolean;

  @Column({ default: false })
  hasParking: boolean;

  @Column()
  location: string;

  @Column({ default: 'available' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
