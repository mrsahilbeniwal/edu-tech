import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { UserService } from './user.service';
import { CourseService } from './course.service';
import {
  CreatePaymentOrderDto,
  VerifyPaymentDto,
  PaymentOrder,
  PaymentOrderDocument,
  PaymentStatus,
} from '../dto/payment.dto';
import { PaymentOrder as PaymentOrderSchema } from '../schemas/payment-order.schema';

// Proper TypeScript import for Razorpay
import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private courseService: CourseService,
    @InjectModel(PaymentOrderSchema.name)
    private paymentOrderModel: Model<PaymentOrderDocument>,
  ) {
    // Add logging to debug Razorpay initialization
    const keyId =
      this.configService.get<string>('RAZORPAY_KEY_ID') ||
      process.env.RAZORPAY_KEY_ID ||
      'rzp_test_ghTeekIY3ZvfG3';
    const keySecret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') ||
      process.env.RAZORPAY_KEY_SECRET ||
      'your_secret_key_here';

    console.log('Razorpay Key ID:', keyId ? 'Present' : 'Missing');
    console.log('Razorpay Key Secret:', keySecret ? 'Present' : 'Missing');

    if (!keyId || !keySecret || keySecret === 'your_secret_key_here') {
      console.error('Razorpay credentials are not properly configured');
      throw new Error('Razorpay credentials are not properly configured');
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    console.log('Razorpay instance initialized successfully');
  }

  async createPaymentOrder(createPaymentOrderDto: CreatePaymentOrderDto) {
    try {
      console.log('Creating payment order with data:', createPaymentOrderDto);

      const {
        userId,
        courseId,
        amount,
        currency = 'INR',
      } = createPaymentOrderDto;

      // Add validation for required fields
      if (!userId || !courseId || !amount) {
        throw new BadRequestException(
          'Missing required fields: userId, courseId, or amount',
        );
      }

      console.log('Finding user with ID:', userId);
      const user = await this.userService.findOne(userId);
      if (!user) {
        console.log('User not found for ID:', userId);
        throw new NotFoundException('User not found');
      }
      console.log('User found:', user.email);

      console.log('Finding course with ID:', courseId);
      const course = await this.courseService.getCourseFullDetails(courseId);
      if (!course) {
        console.log('Course not found for ID:', courseId);
        throw new NotFoundException('Course not found');
      }
      console.log('Course found:', course.data?.title);

      const alreadyPurchased = user.purchasedCourses?.some(
        (purchasedCourseId) => purchasedCourseId.toString() === courseId,
      );
      if (alreadyPurchased) {
        console.log('Course already purchased by user');
        throw new BadRequestException('Course already purchased');
      }

      // Generate a shorter receipt (max 40 characters)
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
      const shortCourseId = courseId.slice(-6); // Last 6 characters of courseId
      const shortUserId = userId.slice(-6); // Last 6 characters of userId
      const receipt = `c${shortCourseId}_u${shortUserId}_${timestamp}`;

      console.log('Generated receipt:', receipt, 'Length:', receipt.length);

      const orderData = {
        amount: Math.round(amount * 100), // Convert to paisa
        currency,
        receipt: receipt, // Must be <= 40 characters
        notes: {
          userId,
          courseId,
          courseName: course.data?.title || 'Unknown Course',
          userEmail: user.email,
          userName: user.name,
        },
      };

      console.log('Creating Razorpay order with data:', orderData);

      // Add try-catch specifically for Razorpay API call
      let razorpayOrder;
      try {
        razorpayOrder = await this.razorpay.orders.create(orderData);
        console.log('Razorpay order created successfully:', razorpayOrder.id);
      } catch (razorpayError) {
        console.error('Razorpay API Error:', razorpayError);
        console.error('Razorpay Error Details:', {
          message: razorpayError.message,
          statusCode: razorpayError.statusCode,
          error: razorpayError.error,
        });
        throw new InternalServerErrorException(
          `Razorpay API Error: ${razorpayError.message || 'Unknown error'}`,
        );
      }

      const paymentOrder = new this.paymentOrderModel({
        orderId: razorpayOrder.id,
        userId,
        courseId,
        amount,
        currency,
        status: 'created',
        razorpayOrderId: razorpayOrder.id,
        receipt: razorpayOrder.receipt,
        notes: razorpayOrder.notes,
        createdAt: new Date(),
      });

      console.log('Saving payment order to database');
      await paymentOrder.save();
      console.log('Payment order saved successfully');

      return {
        razorpayOrder,
        paymentOrder,
      };
    } catch (error) {
      console.error('Error in createPaymentOrder:', error);
      console.error('Error stack:', error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create payment order: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    try {
      const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        userId,
        courseId,
      } = verifyPaymentDto;

      const paymentOrder = await this.paymentOrderModel.findOne({
        razorpayOrderId,
        userId,
        courseId,
      });
      if (!paymentOrder) throw new NotFoundException('Payment order not found');

      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const razorpayKeySecret = this.configService.get<string>(
        'RAZORPAY_KEY_SECRET',
      );
      if (!razorpayKeySecret) {
        throw new InternalServerErrorException(
          'Razorpay key secret is not configured',
        );
      }
      const expectedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        paymentOrder.status = PaymentStatus.FAILED;
        paymentOrder.failureReason = 'Invalid signature';
        paymentOrder.updatedAt = new Date();
        await paymentOrder.save();

        throw new BadRequestException('Payment verification failed');
      }

      const payment = await this.razorpay.payments.fetch(razorpayPaymentId);
      if (payment.status !== 'captured') {
        paymentOrder.status = PaymentStatus.FAILED;
        paymentOrder.failureReason = `Payment status: ${payment.status}`;
        paymentOrder.updatedAt = new Date();
        await paymentOrder.save();

        throw new BadRequestException('Payment not captured');
      }

      const user = await this.userService.addToPurchasedCourses(
        userId,
        courseId,
      );
      const course = await this.courseService.getCourseFullDetails(courseId);

      paymentOrder.status = PaymentStatus.COMPLETED;
      paymentOrder.razorpayPaymentId = razorpayPaymentId;
      paymentOrder.razorpaySignature = razorpaySignature;
      paymentOrder.completedAt = new Date();
      paymentOrder.updatedAt = new Date();
      await paymentOrder.save();

      return {
        success: true,
        message:
          'Payment verified successfully and course added to purchased courses',
        user,
        course,
        paymentOrder,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Payment verification failed: ${error.message}`,
      );
    }
  }

  async getPaymentOrder(orderId: string) {
    const paymentOrder = await this.paymentOrderModel.findOne({
      razorpayOrderId: orderId,
    });
    if (!paymentOrder) throw new NotFoundException('Payment order not found');
    return paymentOrder;
  }

  async getUserPaymentHistory(userId: string) {
    const payments = await this.paymentOrderModel
      .find({ userId })
      .populate('courseId', 'title description price image')
      .sort({ createdAt: -1 });

    const totalPayments = payments.length;
    const totalAmount = payments
      .filter((payment) => payment.status === PaymentStatus.COMPLETED)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      payments,
      totalPayments,
      totalAmount,
    };
  }

  async refundPayment(paymentId: string, amount?: number) {
    try {
      const paymentOrder = await this.paymentOrderModel.findOne({
        razorpayPaymentId: paymentId,
        status: 'completed',
      });

      if (!paymentOrder)
        throw new NotFoundException('Completed payment not found');

      const refundAmount = amount
        ? Math.round(amount * 100)
        : Math.round(paymentOrder.amount * 100);

      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: refundAmount,
        speed: 'normal',
        notes: {
          refund_reason: 'Course refund',
          original_order_id: paymentOrder.razorpayOrderId,
        },
      });

      paymentOrder.status = PaymentStatus.REFUNDED;
      paymentOrder.refundId = refund.id;
      paymentOrder.refundAmount = refundAmount / 100;
      paymentOrder.updatedAt = new Date();
      await paymentOrder.save();

      await this.userService.removeFromPurchasedCourses(
        paymentOrder.userId,
        paymentOrder.courseId,
      );

      return {
        success: true,
        refund,
        message:
          'Refund processed successfully and course removed from purchased courses',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Refund processing failed: ${error.message}`,
      );
    }
  }

  async getAllPaymentOrders(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ) {
    const filter: any = {};
    if (status) filter.status = status;

    const total = await this.paymentOrderModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const payments = await this.paymentOrderModel
      .find(filter)
      .populate('userId', 'name email phone')
      .populate('courseId', 'title price image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      payments,
      total,
      page,
      totalPages,
    };
  }
}
