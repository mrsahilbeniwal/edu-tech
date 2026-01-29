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

export class CardDto {
  @ApiProperty()
  @IsString()
  title: string;

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

export class CreateContentSectionDto {
  @ApiProperty()
  @IsString()
  heading: string;

  @ApiProperty({ enum: ['left', 'center', 'right'] })
  @IsEnum(['left', 'center', 'right'])
  headingPosition: 'left' | 'center' | 'right';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subheading?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['left', 'center', 'right'] })
  @IsEnum(['left', 'center', 'right'])
  contentPosition: 'left' | 'center' | 'right';

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isSlideCards?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isGridCards?: boolean;

  @ApiProperty({ type: [CardDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards?: CardDto[];

  @ApiProperty({ default: '#ffffff' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
