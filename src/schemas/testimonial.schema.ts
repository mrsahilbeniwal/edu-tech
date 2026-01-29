import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Testimonial {
  @Prop({ required: true, trim: true })
  studentName: string;

  @Prop({ required: true, trim: true })
  studentEmail: string;

  @Prop({ required: true, trim: true })
  course: string;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 1000 })
  message: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ trim: true })
  studentImage?: string;

  @Prop({ trim: true, default: 'https://www.linkedin.com/in/ravikumarsingh22' })
  linkedinUrl?: string;

  @Prop({
    trim: true,
    default:
      'https://png.pngtree.com/element_our/sm/20180627/sm_5b334610deb59.jpg',
  })
  fromCompanyName?: string;

  @Prop({
    trim: true,
    default:
      'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-facebook-logo-png-image_3584860.png',
  })
  toCompanyName?: string;

  @Prop({ trim: true })
  studentRole?: string; // e.g., "Student", "Graduate", "Professional"

  @Prop({ trim: true })
  batchYear?: string;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
