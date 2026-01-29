import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactSubmissionDto {
  @ApiProperty({
    description: 'Name of the person contacting',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mobile number',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  mobile: string;

  @ApiProperty({
    description: 'Message content',
    example: 'I am interested in your courses',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  message: string;
}

export class ContactInfoDto {
  @ApiProperty({
    description: 'Phone number',
    example: '+1-800-123-4567',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address',
    example: 'contact@edtech.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Office address',
    example: '123 Education St, Learning City, LC 12345',
  })
  @IsString()
  @IsNotEmpty()
  office: string;
}
