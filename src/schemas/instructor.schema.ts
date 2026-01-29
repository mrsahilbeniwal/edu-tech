import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type InstructorDocument = Instructor & Document;

@Schema({
  collection: 'instructors',
  timestamps: true,
})
export class Instructor {
  @ApiProperty({
    description: 'Full name of the instructor',
    example: 'John Doe',
  })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({
    description: 'Designation or title of the instructor',
    example: 'Senior Software Engineer & Tech Lead',
  })
  @Prop({ required: true, trim: true })
  designation: string;

  @ApiProperty({
    description: 'Profile image URL of the instructor',
    example: 'https://example.com/images/john-doe.jpg',
  })
  @Prop({ required: true })
  image: string;

  @ApiProperty({
    description: 'Social media handles',
    example: {
      twitter: '@johndoe',
      facebook: 'johndoe.dev',
      instagram: '@johndoe_codes',
    },
  })
  @Prop({
    type: {
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    default: {},
  })
  socialHandles: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt?: Date;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
