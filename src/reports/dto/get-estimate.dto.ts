import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
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
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property (min: 0, max: 1000000)',
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  mileage: number;
}
