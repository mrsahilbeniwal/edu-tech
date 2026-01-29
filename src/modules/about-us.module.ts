import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AboutUsService } from '../services/about-us.service';
import { AboutUsController } from '../controllers/about-us.controller';
import { AboutUs, AboutUsSchema } from '../schemas/about-us.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AboutUs.name, schema: AboutUsSchema }]),
  ],
  controllers: [AboutUsController],
  providers: [AboutUsService],
  exports: [AboutUsService],
})
export class AboutUsModule {}