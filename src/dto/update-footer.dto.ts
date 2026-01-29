import {
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UpdateFooterLinkDto {
  @ApiProperty({ required: false, description: 'Link text' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ required: false, description: 'Link URL' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    required: false,
    default: false,
    description: 'Whether the link is external',
  })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;
}

class UpdateLinkGroupDto {
  @ApiProperty({ required: false, description: 'Group title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: [UpdateFooterLinkDto],
    required: false,
    description: 'Array of links in the group',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFooterLinkDto)
  links?: UpdateFooterLinkDto[];
}

class UpdateSocialLinkDto {
  @ApiProperty({ required: false, description: 'Social media platform name' })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ required: false, description: 'Social media profile URL' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ required: false, description: 'Icon identifier or URL' })
  @IsOptional()
  @IsString()
  icon?: string;
}

class UpdateContactInfoDto {
  @ApiProperty({ required: false, description: 'Contact email address' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, description: 'Physical address' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateFooterDto {
  @ApiProperty({ required: false, description: 'Footer logo URL or path' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    required: false,
    description: 'Logo alt text for accessibility',
  })
  @IsOptional()
  @IsString()
  logoAlt?: string;

  @ApiProperty({ required: false, description: 'Footer description text' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: [UpdateLinkGroupDto],
    required: false,
    description: 'Groups of footer links',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLinkGroupDto)
  linkGroups?: UpdateLinkGroupDto[];

  @ApiProperty({
    type: [UpdateSocialLinkDto],
    required: false,
    description: 'Social media links',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSocialLinkDto)
  socialLinks?: UpdateSocialLinkDto[];

  @ApiProperty({
    type: UpdateContactInfoDto,
    required: false,
    description: 'Contact information',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContactInfoDto)
  contactInfo?: UpdateContactInfoDto;

  @ApiProperty({ required: false, description: 'Copyright text' })
  @IsOptional()
  @IsString()
  copyrightText?: string;

  @ApiProperty({
    required: false,
    default: '#1a202c',
    description: 'Footer background color (hex code)',
  })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({
    required: false,
    default: '#ffffff',
    description: 'Footer text color (hex code)',
  })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiProperty({
    required: false,
    default: true,
    description: 'Whether the footer configuration is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
