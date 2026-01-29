import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import {
  CreatePaymentOrderDto,
  VerifyPaymentDto,
  RefundPaymentDto,
} from '../dto/payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Razorpay payment order for course purchase',
    description: 'Creates a Razorpay order and saves payment details in database',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment order created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        razorpayOrder: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            receipt: { type: 'string' },
            status: { type: 'string' },
          },
        },
        paymentOrder: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or Course not found' })
  @ApiBearerAuth()
  async createPaymentOrder(
    @Body() createPaymentOrderDto: CreatePaymentOrderDto,
  ): Promise<{
    success: boolean;
    message: string;
    razorpayOrder: any;
    paymentOrder: any;
  }> {
    const result = await this.paymentService.createPaymentOrder(
      createPaymentOrderDto,
    );

    return {
      success: true,
      message: 'Payment order created successfully',
      razorpayOrder: result.razorpayOrder,
      paymentOrder: result.paymentOrder,
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Razorpay payment and add course to purchased courses',
    description:
      'Verifies payment signature and automatically adds course to user purchased courses on success',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment verified and course added successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        user: { type: 'object' },
        course: { type: 'object' },
        paymentOrder: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Payment verification failed' })
  @ApiResponse({ status: 404, description: 'Payment order not found' })
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto): Promise<{
    success: boolean;
    message: string;
    user?: any;
    course?: any;
    paymentOrder?: any;
  }> {
    return await this.paymentService.verifyPayment(verifyPaymentDto);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payment order details' })
  @ApiParam({ name: 'orderId', description: 'Razorpay Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment order details',
  })
  @ApiResponse({ status: 404, description: 'Payment order not found' })
  @ApiBearerAuth()
  async getPaymentOrder(@Param('orderId') orderId: string): Promise<{
    success: boolean;
    paymentOrder: any;
  }> {
    const paymentOrder = await this.paymentService.getPaymentOrder(orderId);
    return {
      success: true,
      paymentOrder,
    };
  }

  @Get('user/:userId/history')
  @ApiOperation({ summary: 'Get user payment history' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User payment history retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async getUserPaymentHistory(@Param('userId') userId: string): Promise<{
    success: boolean;
    data: {
      payments: any[];
      totalPayments: number;
      totalAmount: number;
    };
  }> {
    const data = await this.paymentService.getUserPaymentHistory(userId);
    return {
      success: true,
      data,
    };
  }

  @Post('refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process refund for a payment',
    description: 'Refunds payment and removes course from user purchased courses',
  })
  @ApiResponse({
    status: 200,
    description: 'Refund processed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        refund: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Refund processing failed' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiBearerAuth()
  async refundPayment(@Body() refundPaymentDto: RefundPaymentDto): Promise<{
    success: boolean;
    message: string;
    refund: any;
  }> {
    const result = await this.paymentService.refundPayment(
      refundPaymentDto.paymentId,
      refundPaymentDto.amount,
    );

    return {
      success: result.success,
      message: result.message,
      refund: result.refund,
    };
  }

  @Get('admin/all')
  @ApiOperation({ summary: 'Get all payment orders (Admin)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by payment status',
    enum: ['created', 'completed', 'failed', 'refunded'],
  })
  @ApiResponse({
    status: 200,
    description: 'Payment orders retrieved successfully',
  })
  @ApiBearerAuth()
  async getAllPaymentOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ): Promise<{
    success: boolean;
    data: {
      payments: any[];
      total: number;
      page: number;
      totalPages: number;
    };
  }> {
    const data = await this.paymentService.getAllPaymentOrders(
      page || 1,
      limit || 10,
      status,
    );

    return {
      success: true,
      data,
    };
  }

  @Get('config')
  @ApiOperation({ summary: 'Get Razorpay configuration for frontend' })
  @ApiResponse({
    status: 200,
    description: 'Razorpay configuration',
    schema: {
      type: 'object',
      properties: {
        keyId: { type: 'string' },
        currency: { type: 'string' },
      },
    },
  })
  getRazorpayConfig(): {
    success: boolean;
    config: {
      keyId: string;
      currency: string;
    };
  } {
    return {
      success: true,
      config: {
        keyId: process.env.RAZORPAY_KEY_ID ?? '',
        currency: 'INR',
      },
    };
  }
}