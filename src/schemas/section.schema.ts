import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SectionDocument = Section & Document;

@Schema({ timestamps: true })
export class Section {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  heading: string;

  @Prop({ enum: ['left', 'center', 'right'], default: 'center' })
  headingPosition: 'left' | 'center' | 'right';

  @Prop()
  subheading: string;

  @Prop()
  description: string;

  @Prop()
  leftContent: string;

  @Prop()
  rightContent: string;

  @Prop({ enum: ['left', 'right', 'full'], default: 'full' })
  contentLayout: 'left' | 'right' | 'full';

  @Prop({ default: false })
  hasCards: boolean;

  @Prop({
    type: [
      {
        title: { type: String, required: true },
        description: String,
        image: String,
        imageAlt: String,
        url: String,
        buttonText: String,
        buttonUrl: String,
        icon: String,
        features: [String],
      },
    ],
  })
  cards: Array<{
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    url?: string;
    buttonText?: string;
    buttonUrl?: string;
    icon?: string;
    features?: string[];
  }>;

  @Prop({ default: '#ffffff' })
  backgroundColor: string;

  @Prop({ default: 'py-16' })
  spacing: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
