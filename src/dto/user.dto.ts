import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  MinLength,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User phone number', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'User interest/course interest',
    example: 'Web Development',
  })
  @IsString()
  @IsOptional()
  interest?: string;

  @ApiProperty({
    description: 'Educational stream',
    example: 'Computer Science',
  })
  @IsString()
  @IsOptional()
  stream?: string;

  @ApiProperty({ description: 'Additional message from user', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'User status',
    example: 'active',
    enum: ['active', 'inactive', 'blocked'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'blocked'])
  status?: string;
}

export class EnquiryFormDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User phone number', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'User interest/course interest',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  interest: string;

  @ApiProperty({
    description: 'Educational stream',
    example: 'Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  stream: string;

  @ApiProperty({ description: 'Additional message from user', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Important user flag', required: false })
  @IsOptional()
  @IsBoolean()
  important?: boolean;
}

export class UserQueryDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Items per page', example: 10, required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: 'Search by name or email', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by status',
    enum: ['active', 'inactive', 'blocked'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'blocked'])
  status?: string;

  @ApiProperty({ description: 'Filter by important flag', required: false })
  @IsOptional()
  @IsBoolean()
  important?: boolean;

  @ApiProperty({ description: 'Filter by interest', required: false })
  @IsOptional()
  @IsString()
  interest?: string;

  @ApiProperty({ description: 'Filter by stream', required: false })
  @IsOptional()
  @IsString()
  stream?: string;
}

// New DTOs for cart functionality
export class AddToCartDto {
  @ApiProperty({
    description: 'Course ID to add to cart',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}

export class RemoveFromCartDto {
  @ApiProperty({
    description: 'Course ID to remove from cart',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}

export class UpdateCartDto {
  @ApiProperty({
    description: 'Array of course IDs for the cart',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  courseIds: string[];
}
