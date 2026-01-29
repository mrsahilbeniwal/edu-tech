import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ContentSectionDocument = ContentSection & Document;

@Schema({ timestamps: true })
export class ContentSection {
  @Prop({ required: true })
  heading: string;

  @Prop({ enum: ['left', 'center', 'right'], default: 'center' })
  headingPosition: 'left' | 'center' | 'right';

  @Prop()
  subheading: string;

  @Prop()
  description: string;

  @Prop({ enum: ['left', 'center', 'right'], default: 'left' })
  contentPosition: 'left' | 'center' | 'right';

  @Prop({ default: false })
  isSlideCards: boolean;

  @Prop({ default: false })
  isGridCards: boolean;

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
        tags: [String],
        price: String,
        originalPrice: String,
        rating: { type: Number, min: 0, max: 5 },
        reviewCount: Number,
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
    tags?: string[];
    price?: string;
    originalPrice?: string;
    rating?: number;
    reviewCount?: number;
  }>;

  @Prop({ default: '#ffffff' })
  backgroundColor: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const ContentSectionSchema =
  SchemaFactory.createForClass(ContentSection);
