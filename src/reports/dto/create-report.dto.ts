import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  make: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  model: string;

  @ApiProperty({
    type: Number,
    description: 'This is a required property (min: 1930, max: 2050)',
  })
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @IsLongitude()
  lng: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @IsLatitude()
  lat: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property (min: 0, max: 1000000)',
  })
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  mileage: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property (min: 0, max: 1000000)',
  })
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  price: number;
}
