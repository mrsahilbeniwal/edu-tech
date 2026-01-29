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

class SectionCardDto {
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
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  features?: string[];
}

export class CreateSectionDto {
  @ApiProperty()
  @IsString()
  title: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  leftContent?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rightContent?: string;

  @ApiProperty({ enum: ['left', 'right', 'full'] })
  @IsEnum(['left', 'right', 'full'])
  contentLayout: 'left' | 'right' | 'full';

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  hasCards?: boolean;

  @ApiProperty({ type: [SectionCardDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionCardDto)
  cards?: SectionCardDto[];

  @ApiProperty({ default: '#ffffff' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ default: 'py-16' })
  @IsOptional()
  @IsString()
  spacing?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
