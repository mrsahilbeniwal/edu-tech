import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AboutUsDocument = AboutUs & Document;

@Schema({
  timestamps: true,
  collection: 'aboutus'
})
export class AboutUs {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    type: [String], 
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length === 6;
      },
      message: 'Exactly 6 reasons must be provided'
    }
  })
  whyChooseUs: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const AboutUsSchema = SchemaFactory.createForClass(AboutUs);