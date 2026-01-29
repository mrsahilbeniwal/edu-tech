import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @ApiProperty({ description: 'User phone number', example: '+1234567890' })
  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @ApiProperty({
    description: 'User interest/course interest',
    example: 'Web Development',
  })
  @Prop({ required: false, trim: true })
  interest?: string;

  @ApiProperty({
    description: 'Educational stream',
    example: 'Computer Science',
  })
  @Prop({ required: false, trim: true })
  stream?: string;

  @ApiProperty({ description: 'Additional message from user', required: false })
  @Prop({ trim: true })
  message?: string;

  @ApiProperty({
    description: 'User status',
    example: 'active',
    enum: ['active', 'inactive', 'blocked'],
  })
  @Prop({ default: 'active', enum: ['active', 'inactive', 'blocked'] })
  status: string;

  @ApiProperty({
    description: 'Important user flag - set to true for repeat enquiries',
    default: false,
  })
  @Prop({ default: false })
  important: boolean;

  @ApiProperty({
    description: 'Number of times user has submitted enquiry',
    default: 1,
  })
  @Prop({ default: 1 })
  enquiryCount: number;

  @ApiProperty({ description: 'Last enquiry date' })
  @Prop({ default: Date.now })
  lastEnquiryDate: Date;

  @ApiProperty({
    description: 'Array of course IDs in user cart',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
  cart: Types.ObjectId[];

  @ApiProperty({
    description: 'Array of purchased course IDs',
    example: ['507f1f77bcf86cd799439013'],
    type: [String],
  })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
  purchasedCourses: Types.ObjectId[];

  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update date' })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
