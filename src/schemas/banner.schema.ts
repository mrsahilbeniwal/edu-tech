import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true })
  backgroundImage: string;

  @Prop()
  backgroundImageAlt: string;

  @Prop({
    type: {
      heading: String,
      subheading: String,
      description: String,
      position: {
        type: String,
        enum: ['left', 'center', 'right'],
        default: 'center',
      },
      textColor: { type: String, default: '#ffffff' },
      backgroundColor: String,
      opacity: { type: Number, min: 0, max: 1, default: 0.8 },
    },
  })
  textOverlay: {
    heading?: string;
    subheading?: string;
    description?: string;
    position: 'left' | 'center' | 'right';
    textColor: string;
    backgroundColor?: string;
    opacity: number;
  };

  @Prop({
    type: [
      {
        text: { type: String, required: true },
        url: { type: String, required: true },
        variant: {
          type: String,
          enum: ['primary', 'secondary', 'outline'],
          default: 'primary',
        },
        size: {
          type: String,
          enum: ['small', 'medium', 'large'],
          default: 'medium',
        },
      },
    ],
  })
  buttons: Array<{
    text: string;
    url: string;
    variant: 'primary' | 'secondary' | 'outline';
    size: 'small' | 'medium' | 'large';
  }>;

  @Prop({ min: 200, max: 1000, default: 500 })
  height: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: '' })
  url: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
