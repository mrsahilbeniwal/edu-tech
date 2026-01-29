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

  @ApiProperty({ enum: ['left', 'center', 'right'] })
  @IsEnum(['left', 'center', 'right'])
  position: 'left' | 'center' | 'right';

  @ApiProperty({ default: '#ffffff' })
  @IsString()
  textColor: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ default: 0.8 })
  @IsNumber()
  @Min(0)
  @Max(1)
  opacity: number;
}

class BannerButtonDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ enum: ['primary', 'secondary', 'outline'] })
  @IsEnum(['primary', 'secondary', 'outline'])
  variant: 'primary' | 'secondary' | 'outline';

  @ApiProperty({ enum: ['small', 'medium', 'large'] })
  @IsEnum(['small', 'medium', 'large'])
  size: 'small' | 'medium' | 'large';
}

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  backgroundImage: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundImageAlt?: string;

  @ApiProperty({ type: TextOverlayDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => TextOverlayDto)
  textOverlay?: TextOverlayDto;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ type: [BannerButtonDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BannerButtonDto)
  buttons?: BannerButtonDto[];

  @ApiProperty({ default: 500 })
  @IsOptional()
  @IsNumber()
  @Min(200)
  @Max(1000)
  height?: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
