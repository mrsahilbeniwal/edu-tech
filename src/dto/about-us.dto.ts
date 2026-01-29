import { IsString, IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAboutUsDto {
  @ApiProperty({ 
    description: 'About us image URL',
    example: 'https://example.com/about-us-image.jpg'
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ 
    description: 'About us title',
    example: 'Welcome to EduTech - Transforming Learning Experience'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'About us description',
    example: 'We are dedicated to providing high-quality online education that empowers learners worldwide...'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Six reasons why users should choose us',
    example: [
      'Expert instructors with industry experience',
      'Comprehensive curriculum designed for real-world applications',
      'Interactive learning environment with hands-on projects',
      '24/7 student support and mentorship',
      'Flexible learning schedules that fit your lifestyle',
      'Industry-recognized certifications upon completion'
    ]
  })
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  whyChooseUs: string[];

  @ApiProperty({ 
    description: 'Whether the about us section is active',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'Display order',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateAboutUsDto {
  @ApiProperty({ 
    description: 'About us image URL',
    example: 'https://example.com/about-us-image.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image?: string;

  @ApiProperty({ 
    description: 'About us title',
    example: 'Welcome to EduTech - Transforming Learning Experience',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({ 
    description: 'About us description',
    example: 'We are dedicated to providing high-quality online education...',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ 
    description: 'Six reasons why users should choose us',
    example: [
      'Expert instructors with industry experience',
      'Comprehensive curriculum designed for real-world applications',
      'Interactive learning environment with hands-on projects',
      '24/7 student support and mentorship',
      'Flexible learning schedules that fit your lifestyle',
      'Industry-recognized certifications upon completion'
    ],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  whyChooseUs?: string[];

  @ApiProperty({ 
    description: 'Whether the about us section is active',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'Display order',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}
