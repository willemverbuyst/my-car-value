import { ApiProperty } from '@nestjs/swagger';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'test@test.io' })
  @Column()
  email: string;

  @ApiProperty({ example: 'testPassword123' })
  @Column()
  password: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id', this.id);
  }
}
