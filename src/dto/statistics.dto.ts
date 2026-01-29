import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateStatisticsDto {
  @ApiProperty({
    description: 'Total number of users on the platform',
    example: 10000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalUsers: number;

  @ApiProperty({
    description: 'Total number of instructors on the platform',
    example: 250,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalInstructors: number;

  @ApiProperty({
    description: 'Country reached by the platform',
    example: 'India',
    required: false,
    default: 'India',
  })
  @IsString()
  @IsOptional()
  countryReached?: string = 'India';

  @ApiProperty({
    description: 'Course completion rate percentage',
    example: 98,
    minimum: 0,
    maximum: 100,
    required: false,
    default: 98,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  courseCompletionRate?: number = 98;
}

export class UpdateStatisticsDto {
  @ApiProperty({
    description: 'Total number of users on the platform',
    example: 10000,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalUsers?: number;

  @ApiProperty({
    description: 'Total number of instructors on the platform',
    example: 250,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalInstructors?: number;

  @ApiProperty({
    description: 'Country reached by the platform',
    example: 'India',
    required: false,
  })
  @IsString()
  @IsOptional()
  countryReached?: string;

  @ApiProperty({
    description: 'Course completion rate percentage',
    example: 98,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  courseCompletionRate?: number;
}
