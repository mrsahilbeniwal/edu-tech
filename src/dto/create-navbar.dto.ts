import {
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class MenuItemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @ApiProperty({
    required: false,
    type: [MenuItemDto],
    description: 'Nested menu items for dropdown menus',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  children?: MenuItemDto[];
}

class CtaButtonDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ enum: ['primary', 'secondary', 'outline'] })
  @IsEnum(['primary', 'secondary', 'outline'])
  variant: 'primary' | 'secondary' | 'outline';
}

export class CreateNavbarDto {
  @ApiProperty()
  @IsString()
  logo: string;

  @ApiProperty()
  @IsString()
  logoAlt: string;

  @ApiProperty({ type: [MenuItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  menuItems: MenuItemDto[];

  @ApiProperty({ type: CtaButtonDto })
  @ValidateNested()
  @Type(() => CtaButtonDto)
  ctaButton: CtaButtonDto;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Export MenuItemDto for use in other files if needed
export { MenuItemDto, CtaButtonDto };
