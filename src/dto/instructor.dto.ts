import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class SocialHandlesDto {
  @ApiPropertyOptional({
    description: 'Twitter handle (without @)',
    example: 'johndoe',
  })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional({
    description: 'Facebook username or page name',
    example: 'johndoe.dev',
  })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({
    description: 'Instagram handle (without @)',
    example: 'johndoe_codes',
  })
  @IsOptional()
  @IsString()
  instagram?: string;
}

export class CreateInstructorDto {
  @ApiProperty({
    description: 'Full name of the instructor',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Designation or title of the instructor',
    example: 'Senior Software Engineer & Tech Lead',
  })
  @IsNotEmpty()
  @IsString()
  designation: string;

  @ApiProperty({
    description: 'Profile image URL of the instructor',
    example: 'https://example.com/images/john-doe.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiPropertyOptional({
    description: 'Social media handles',
    type: SocialHandlesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialHandlesDto)
  socialHandles?: SocialHandlesDto;
}

export class UpdateInstructorDto extends PartialType(CreateInstructorDto) {}

export class InstructorResponseDto {
  @ApiProperty({
    description: 'Instructor ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the instructor',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Designation or title of the instructor',
    example: 'Senior Software Engineer & Tech Lead',
  })
  designation: string;

  @ApiProperty({
    description: 'Profile image URL of the instructor',
    example: 'https://example.com/images/john-doe.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Social media handles',
    type: SocialHandlesDto,
  })
  socialHandles: SocialHandlesDto;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
