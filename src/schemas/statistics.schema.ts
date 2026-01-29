import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatisticsDocument = Statistics & Document;

@Schema({ timestamps: true })
export class Statistics {
  @Prop({ required: true })
  totalUsers: number;

  @Prop({ required: true })
  totalInstructors: number;

  @Prop({ required: true, default: 'India' })
  countryReached: string;

  @Prop({ required: true, default: 98 })
  courseCompletionRate: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);