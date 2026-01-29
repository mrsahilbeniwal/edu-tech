import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionalBannerService } from '../services/promotional-banner.service';
import { PromotionalBannerController } from '../controllers/promotional-banner.controller';
import {
  PromotionalBanner,
  PromotionalBannerSchema,
} from '../schemas/promotional-banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromotionalBanner.name, schema: PromotionalBannerSchema },
    ]),
  ],
  controllers: [PromotionalBannerController],
  providers: [PromotionalBannerService],
  exports: [PromotionalBannerService],
})
export class PromotionalBannerModule {}
