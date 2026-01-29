import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCourseDto {
  @ApiProperty({ required: false, example: 'web-development' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: 'Beginner' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ required: false, example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    required: false,
    example: 'price',
    description: 'Sort by: price, rating, enrolledStudents',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    required: false,
    example: 'asc',
    description: 'Sort order: asc, desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiProperty({
    required: false,
    example: 'React',
    description: 'Search in course titles',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
