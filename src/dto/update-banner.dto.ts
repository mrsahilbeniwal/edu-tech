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

class TextOverlayDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heading?: string;

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
  position?: 'left' | 'center' | 'right';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  opacity?: number;
}

class BannerButtonDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ enum: ['primary', 'secondary', 'outline'], required: false })
  @IsOptional()
  @IsEnum(['primary', 'secondary', 'outline'])
  variant?: 'primary' | 'secondary' | 'outline';

  @ApiProperty({ enum: ['small', 'medium', 'large'], required: false })
  @IsOptional()
  @IsEnum(['small', 'medium', 'large'])
  size?: 'small' | 'medium' | 'large';
}

export class UpdateBannerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundImageAlt?: string;

  @ApiProperty({ type: TextOverlayDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TextOverlayDto)
  textOverlay?: TextOverlayDto;

  @ApiProperty({ type: [BannerButtonDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BannerButtonDto)
  buttons?: BannerButtonDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(200)
  @Max(1000)
  height?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}