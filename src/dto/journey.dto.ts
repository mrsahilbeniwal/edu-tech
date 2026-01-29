import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateJourneyDto {
  @ApiProperty({
    description: 'Year of the journey milestone',
    example: 2023,
    minimum: 2020,
    maximum: 2030
  })
  @IsNumber()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiProperty({
    description: 'Title of the journey milestone',
    example: 'Platform Launch'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the milestone',
    example: 'Successfully launched our EdTech platform with 100+ courses'
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateJourneyDto {
  @ApiProperty({
    description: 'Year of the journey milestone',
    example: 2023,
    minimum: 2020,
    maximum: 2030,
    required: false
  })
  @IsNumber()
  @Min(2020)
  @Max(2030)
  year?: number;

  @ApiProperty({
    description: 'Title of the journey milestone',
    example: 'Platform Launch',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    description: 'Detailed description of the milestone',
    example: 'Successfully launched our EdTech platform with 100+ courses',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  description?: string;
}