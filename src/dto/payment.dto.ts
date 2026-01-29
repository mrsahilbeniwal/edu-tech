import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export class CreatePaymentOrderDto {
  @ApiProperty({
    description: 'User ID who is making the payment',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Course ID to be purchased',
    example: '60d0fe4f5311236168a109cb',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Amount to be paid (in INR)',
    example: 2999,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({
    description: 'Currency for the payment',
    default: 'INR',
    example: 'INR',
  })
  @IsString()
  @IsOptional()
  currency?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Razorpay Order ID',
    example: 'order_ABC123xyz',
  })
  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @ApiProperty({
    description: 'Razorpay Payment ID',
    example: 'pay_XYZ789abc',
  })
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @ApiProperty({
    description: 'Razorpay Signature for verification',
    example: 'signature_string_here',
  })
  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;

  @ApiProperty({
    description: 'User ID who made the payment',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Course ID that was purchased',
    example: '60d0fe4f5311236168a109cb',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

export class RefundPaymentDto {
  @ApiProperty({
    description: 'Razorpay Payment ID to refund',
    example: 'pay_XYZ789abc',
  })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiPropertyOptional({
    description: 'Amount to refund (optional, full refund if not provided)',
    example: 1500,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  amount?: number;
}

export enum PaymentStatus {
  CREATED = 'created',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export class PaymentOrder {
  @ApiProperty({
    description: 'Payment order ID',
    example: '60d0fe4f5311236168a109cc',
  })
  _id: string;

  @ApiProperty({
    description: 'Razorpay Order ID',
    example: 'order_ABC123xyz',
  })
  orderId: string;

  @ApiProperty({
    description: 'User ID who made the payment',
    example: '60d0fe4f5311236168a109ca',
  })
  userId: string;

  @ApiProperty({
    description: 'Course ID that was purchased',
    example: '60d0fe4f5311236168a109cb',
  })
  courseId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 2999,
  })
  amount: number;

  @ApiProperty({
    description: 'Payment currency',
    example: 'INR',
  })
  currency: string;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'Razorpay Order ID',
    example: 'order_ABC123xyz',
  })
  razorpayOrderId: string;

  @ApiPropertyOptional({
    description: 'Razorpay Payment ID (available after payment)',
    example: 'pay_XYZ789abc',
  })
  razorpayPaymentId?: string;

  @ApiPropertyOptional({
    description: 'Razorpay Signature (available after payment verification)',
    example: 'signature_string_here',
  })
  razorpaySignature?: string;

  @ApiProperty({
    description: 'Payment receipt',
    example: 'course_60d0fe4f5311236168a109cb_user_60d0fe4f5311236168a109ca_1625097599000',
  })
  receipt: string;

  @ApiPropertyOptional({
    description: 'Payment notes',
    example: {
      userId: '60d0fe4f5311236168a109ca',
      courseId: '60d0fe4f5311236168a109cb',
      courseName: 'Advanced React Course',
    },
  })
  notes?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Failure reason (if payment failed)',
    example: 'Invalid signature',
  })
  failureReason?: string;

  @ApiPropertyOptional({
    description: 'Refund ID (if payment was refunded)',
    example: 'rfnd_ABC123xyz',
  })
  refundId?: string;

  @ApiPropertyOptional({
    description: 'Refund amount (if payment was refunded)',
    example: 2999,
  })
  refundAmount?: number;

  @ApiProperty({
    description: 'Payment order creation date',
    example: '2021-07-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Payment order last update date',
    example: '2021-07-01T00:05:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Payment completion date',
    example: '2021-07-01T00:05:00.000Z',
  })
  completedAt?: Date;
}

export type PaymentOrderDocument = PaymentOrder & Document;