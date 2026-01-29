import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'John Doe', description: 'Student full name' })
  @IsString()
  @MinLength(2)
  studentName: string;

  @ApiProperty({
    example: 'john.doe@email.com',
    description: 'Student email address',
  })
  @IsEmail()
  studentEmail: string;

  @ApiProperty({
    example: 'Full Stack Web Development',
    description: 'Course name',
  })
  @IsString()
  @MinLength(2)
  course: string;

  @ApiProperty({
    example:
      'This course completely transformed my career! The instructors were amazing and the content was very practical.',
    description: 'Testimonial message',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  message: string;

  @ApiProperty({
    example: 5,
    description: 'Rating from 1 to 5',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: 'https://example.com/student-photo.jpg',
    description: 'Student profile image URL',
  })
  @IsOptional()
  @IsString()
  studentImage?: string;

  @ApiPropertyOptional({
    example: 'Graduate',
    description: 'Student role or status',
  })
  @IsOptional()
  @IsString()
  studentRole?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/company-logo.png',
    description: 'Student company name',
  })
  @IsOptional()
  @IsString()
  toCompanyName?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/company-logo.png',
    description: 'Student company name',
  })
  @IsOptional()
  @IsString()
  fromCompanyName?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/johndoe',
    description: 'Student LinkedIn profile URL',
  })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({ example: '2024', description: 'Batch year' })
  @IsOptional()
  @IsString()
  batchYear?: string;
}

export class UpdateTestimonialDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Student full name',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  studentName?: string;

  @ApiPropertyOptional({
    example: 'john.doe@email.com',
    description: 'Student email address',
  })
  @IsOptional()
  @IsEmail()
  studentEmail?: string;

  @ApiPropertyOptional({
    example: 'Full Stack Web Development',
    description: 'Course name',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  course?: string;

  @ApiPropertyOptional({
    example: 'This course completely transformed my career!',
    description: 'Testimonial message',
    minLength: 10,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  message?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Rating from 1 to 5',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/student-photo.jpg',
    description: 'Student profile image URL',
  })
  @IsOptional()
  @IsString()
  studentImage?: string;

  @ApiPropertyOptional({
    example: 'Graduate',
    description: 'Student role or status',
  })
  @IsOptional()
  @IsString()
  studentRole?: string;

  @ApiPropertyOptional({ example: '2024', description: 'Batch year' })
  @IsOptional()
  @IsString()
  batchYear?: string;

  @ApiPropertyOptional({
    example: 'approved',
    description: 'Testimonial status',
  })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether testimonial is featured',
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether testimonial is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class TestimonialQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'approved', description: 'Filter by status' })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: string;

  @ApiPropertyOptional({
    example: 'Full Stack Web Development',
    description: 'Filter by course',
  })
  @IsOptional()
  @IsString()
  course?: string;

  @ApiPropertyOptional({ example: 5, description: 'Filter by rating' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter featured testimonials',
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 'rating', description: 'Sort field' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ example: 'desc', description: 'Sort order' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
