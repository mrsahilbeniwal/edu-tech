import {
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
 
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class FooterLinkDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;
}

class LinkGroupDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: [FooterLinkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  links: FooterLinkDto[];
}

class SocialLinkDto {
  @ApiProperty()
  @IsString()
  platform: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  icon: string;
}

class ContactInfoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateFooterDto {
  @ApiProperty()
  @IsString()
  logo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logoAlt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [LinkGroupDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkGroupDto)
  linkGroups?: LinkGroupDto[];

  @ApiProperty({ type: [SocialLinkDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @ApiProperty({ type: ContactInfoDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo?: ContactInfoDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  copyrightText?: string;

  @ApiProperty({ default: '#1a202c' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ default: '#ffffff' })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}