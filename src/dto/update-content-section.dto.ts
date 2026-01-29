import {
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

// Create a separate UpdateCardDto without inheritance
class UpdateCardDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageAlt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  buttonText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  buttonUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  originalPrice?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  reviewCount?: number;
}

// Create UpdateContentSectionDto without extending PartialType to avoid conflicts
export class UpdateContentSectionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heading?: string;

  @ApiProperty({ enum: ['left', 'center', 'right'], required: false })
  @IsOptional()
  @IsEnum(['left', 'center', 'right'])
  headingPosition?: 'left' | 'center' | 'right';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subheading?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['left', 'center', 'right'], required: false })
  @IsOptional()
  @IsEnum(['left', 'center', 'right'])
  contentPosition?: 'left' | 'center' | 'right';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isSlideCards?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isGridCards?: boolean;

  @ApiProperty({ type: [UpdateCardDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCardDto)
  cards?: UpdateCardDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
