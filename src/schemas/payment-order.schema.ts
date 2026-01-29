import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentOrderDocument = PaymentOrder & Document;

@Schema({ timestamps: true })
export class PaymentOrder {
  @Prop({ required: true, unique: true })
  orderId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'INR' })
  currency: string;

  @Prop({
    required: true,
    enum: ['created', 'completed', 'failed', 'refunded'],
    default: 'created',
  })
  status: string;

  @Prop({ required: true })
  razorpayOrderId: string;

  @Prop()
  razorpayPaymentId: string;

  @Prop()
  razorpaySignature: string;

  @Prop({ required: true })
  receipt: string;

  @Prop({ type: Object })
  notes: Record<string, any>;

  @Prop()
  failureReason: string;

  @Prop()
  refundId: string;

  @Prop()
  refundAmount: number;

  @Prop()
  completedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PaymentOrderSchema = SchemaFactory.createForClass(PaymentOrder);

// Add indexes for better query performance
PaymentOrderSchema.index({ userId: 1, status: 1 });
PaymentOrderSchema.index({ razorpayOrderId: 1 });
PaymentOrderSchema.index({ razorpayPaymentId: 1 });
PaymentOrderSchema.index({ createdAt: -1 });