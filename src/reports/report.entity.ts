import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: false })
  @Column({ default: false })
  approved: boolean;

  @ApiProperty({ example: 10000 })
  @Column()
  price: number;

  @ApiProperty({ example: 'Toyota' })
  @Column()
  make: string;

  @ApiProperty({ example: 'Corolla' })
  @Column()
  model: string;

  @ApiProperty({ example: 1980 })
  @Column()
  year: number;

  @ApiProperty({ example: 0 })
  @Column()
  lng: number;

  @ApiProperty({ example: 0 })
  @Column()
  lat: number;

  @ApiProperty({ example: 250000 })
  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
