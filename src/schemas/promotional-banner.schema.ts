import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromotionalBannerDocument = PromotionalBanner & Document;

@Schema({
  timestamps: true,
  collection: 'promotional_banners',
})
export class PromotionalBanner {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: false })
  ctaText?: string;

  @Prop({ required: false })
  ctaUrl?: string;

  @Prop({ required: true, enum: ['top', 'center', 'bottom'], default: 'center' })
  position: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: 0 })
  priority: number;

  @Prop({ required: false })
  startDate?: Date;

  @Prop({ required: false })
  endDate?: Date;

  @Prop({ required: true, enum: ['popup', 'banner', 'toast'], default: 'popup' })
  displayType: string;

  @Prop({ required: true, default: 5000 })
  autoCloseDelay: number; // in milliseconds

  @Prop({ required: true, default: true })
  showCloseButton: boolean;

  @Prop({ required: true, default: 0 })
  impressions: number;

  @Prop({ required: true, default: 0 })
  clicks: number;

  @Prop({ required: false })
  targetAudience?: string;

  @Prop({ required: false })
  deviceType?: string; // mobile, desktop, tablet, all

  @Prop({ required: false })
  backgroundColor?: string;

  @Prop({ required: false })
  textColor?: string;

  @Prop({ required: false })
  borderColor?: string;

  @Prop({ required: false })
  borderRadius?: number;

  @Prop({ required: false })
  maxWidth?: number;

  @Prop({ required: false })
  maxHeight?: number;

  @Prop({ required: false })
  tags?: string[];

  @Prop({ required: false })
  createdBy?: string;

  @Prop({ required: false })
  updatedBy?: string;
}

export const PromotionalBannerSchema = SchemaFactory.createForClass(PromotionalBanner);
