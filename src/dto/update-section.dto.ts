import {
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSectionCardDto {
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
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  features?: string[];
}

export class UpdateSectionDto {
  @ApiProperty({ required: false })

  @IsString()
  title?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  leftContent?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rightContent?: string;

  @ApiProperty({ enum: ['left', 'right', 'full'], required: false })
  @IsOptional()
  @IsEnum(['left', 'right', 'full'])
  contentLayout?: 'left' | 'right' | 'full';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasCards?: boolean;

  @ApiProperty({ type: [UpdateSectionCardDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSectionCardDto)
  cards?: UpdateSectionCardDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  spacing?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}