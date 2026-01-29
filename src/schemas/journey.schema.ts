import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JourneyDocument = Journey & Document;

@Schema({ timestamps: true })
export class Journey {
  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const JourneySchema = SchemaFactory.createForClass(Journey);