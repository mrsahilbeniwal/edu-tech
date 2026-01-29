import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CmsModule } from './modules/cms.module';
import { UserModule } from './modules/user.module';
import { AnalyticsModule } from './modules/analytics.module';
import { CourseModule } from './modules/course.module';
import { InstructorModule } from './modules/instructor.module';
import { TestimonialModule } from './modules/testimonial.module';
import { AboutUsModule } from './modules/about-us.module';
import { ContactModule } from './modules/contact.module';
import { PartnerModule } from './modules/partner.module';
import { PromotionalBannerModule } from './modules/promotional-banner.module';
import { JourneyModule } from './modules/journey.module';
import { StatisticsModule } from './modules/statistics.module';
import { PaymentModule } from './modules/payment.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongoDB connection with ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/edtech-website',
        dbName: 'edtechplatform',
      }),
      inject: [ConfigService],
    }),
    // CMS Module
    CmsModule,
    UserModule,
    AnalyticsModule,
    CourseModule,
    InstructorModule,
    TestimonialModule,
    AboutUsModule,
    ContactModule,
    PartnerModule,
    PromotionalBannerModule,
    JourneyModule,
    StatisticsModule,
    PaymentModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
