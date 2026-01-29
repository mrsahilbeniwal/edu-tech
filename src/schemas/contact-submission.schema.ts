import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactSubmissionDocument = ContactSubmission & Document;

@Schema({ timestamps: true })
export class ContactSubmission {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  mobile: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'pending' })
  status: string; // pending, reviewed, replied

  @Prop({ default: Date.now })
  submittedAt: Date;
}

export const ContactSubmissionSchema = SchemaFactory.createForClass(ContactSubmission);