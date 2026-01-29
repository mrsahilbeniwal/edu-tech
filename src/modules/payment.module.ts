import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from '../services/payment.service';
import { PaymentController } from '../controllers/payment.controller';
import {
  PaymentOrder,
  PaymentOrderSchema,
} from '../schemas/payment-order.schema';
import { UserModule } from '../modules/user.module';
import { CourseModule } from '../modules/course.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: PaymentOrder.name, schema: PaymentOrderSchema },
    ]),
    UserModule, // Import UserModule to access UserService
    CourseModule, // Import CourseModule to access CourseService
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
