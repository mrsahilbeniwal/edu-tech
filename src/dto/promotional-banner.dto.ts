import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsArray, IsDateString, IsUrl, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class CreatePromotionalBannerDto {
  @ApiProperty({ description: 'Banner title', example: 'Limited Time Offer!' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Banner description', example: 'Get 50% off on all courses this weekend!' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Banner image URL', example: 'https://example.com/banner.jpg' })
  @IsString()
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional({ description: 'Call-to-action text', example: 'Shop Now' })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional({ description: 'Call-to-action URL', example: 'https://example.com/shop' })
  @IsOptional()
  @IsString()
  @IsUrl()
  ctaUrl?: string;

  @ApiProperty({ description: 'Banner position', enum: ['top', 'center', 'bottom'], default: 'center' })
  @IsEnum(['top', 'center', 'bottom'])
  position: string;

  @ApiProperty({ description: 'Is banner active', default: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;

  @ApiProperty({ description: 'Banner priority (higher number = higher priority)', default: 0 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  priority: number;

  @ApiPropertyOptional({ description: 'Banner start date', example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Banner end date', example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ description: 'Display type', enum: ['popup', 'banner', 'toast'], default: 'popup' })
  @IsEnum(['popup', 'banner', 'toast'])
  displayType: string;

  @ApiProperty({ description: 'Auto close delay in milliseconds', default: 5000 })
  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(30000)
  autoCloseDelay: number;

  @ApiProperty({ description: 'Show close button', default: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showCloseButton: boolean;

  @ApiPropertyOptional({ description: 'Target audience', example: 'students' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Device type', example: 'all' })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Background color', example: '#ffffff' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: 'Text color', example: '#000000' })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional({ description: 'Border color', example: '#cccccc' })
  @IsOptional()
  @IsString()
  borderColor?: string;

  @ApiPropertyOptional({ description: 'Border radius in pixels', example: 8 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  borderRadius?: number;

  @ApiPropertyOptional({ description: 'Maximum width in pixels', example: 600 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(100)
  maxWidth?: number;

  @ApiPropertyOptional({ description: 'Maximum height in pixels', example: 400 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(100)
  maxHeight?: number;

  @ApiPropertyOptional({ description: 'Tags for categorization', example: ['sale', 'courses'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Created by user ID' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdatePromotionalBannerDto {
  @ApiPropertyOptional({ description: 'Banner title', example: 'Updated Offer!' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Banner description', example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Banner image URL', example: 'https://example.com/new-banner.jpg' })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Call-to-action text', example: 'Learn More' })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional({ description: 'Call-to-action URL', example: 'https://example.com/learn' })
  @IsOptional()
  @IsString()
  @IsUrl()
  ctaUrl?: string;

  @ApiPropertyOptional({ description: 'Banner position', enum: ['top', 'center', 'bottom'] })
  @IsOptional()
  @IsEnum(['top', 'center', 'bottom'])
  position?: string;

  @ApiPropertyOptional({ description: 'Is banner active' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Banner priority' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({ description: 'Banner start date' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Banner end date' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Display type', enum: ['popup', 'banner', 'toast'] })
  @IsOptional()
  @IsEnum(['popup', 'banner', 'toast'])
  displayType?: string;

  @ApiPropertyOptional({ description: 'Auto close delay in milliseconds' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(30000)
  autoCloseDelay?: number;

  @ApiPropertyOptional({ description: 'Show close button' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showCloseButton?: boolean;

  @ApiPropertyOptional({ description: 'Target audience' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Device type' })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Background color' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: 'Text color' })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional({ description: 'Border color' })
  @IsOptional()
  @IsString()
  borderColor?: string;

  @ApiPropertyOptional({ description: 'Border radius in pixels' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  borderRadius?: number;

  @ApiPropertyOptional({ description: 'Maximum width in pixels' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(100)
  maxWidth?: number;

  @ApiPropertyOptional({ description: 'Maximum height in pixels' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(100)
  maxHeight?: number;

  @ApiPropertyOptional({ description: 'Tags for categorization' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Updated by user ID' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}

export class PromotionalBannerQueryDto {
  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by display type' })
  @IsOptional()
  @IsEnum(['popup', 'banner', 'toast'])
  displayType?: string;

  @ApiPropertyOptional({ description: 'Filter by position' })
  @IsOptional()
  @IsEnum(['top', 'center', 'bottom'])
  position?: string;

  @ApiPropertyOptional({ description: 'Filter by target audience' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Filter by device type' })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Sort field', default: 'priority' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'priority';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string = 'desc';
}

export class PromotionalBannerStatsDto {
  @ApiProperty({ description: 'Banner ID' })
  @IsString()
  bannerId: string;

  @ApiPropertyOptional({ description: 'Action type', enum: ['impression', 'click'] })
  @IsOptional()
  @IsEnum(['impression', 'click'])
  action?: string;
}
