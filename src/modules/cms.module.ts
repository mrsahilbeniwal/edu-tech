import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { Navbar, NavbarSchema } from '../schemas/navbar.schema';
import { Banner, BannerSchema } from '../schemas/banner.schema';
import {
  ContentSection,
  ContentSectionSchema,
} from '../schemas/content-section.schema';
import { Section, SectionSchema } from '../schemas/section.schema';
import { Footer, FooterSchema } from '../schemas/footer.schema';

// Controllers
import { NavbarController } from '../controllers/navbar.controller';
import { BannerController } from '../controllers/banner.controller';

// Services
import { NavbarService } from '../services/navbar.service';
import { BannerService } from '../services/banner.service';
import { ContentSectionController } from 'src/controllers/content-section.controller';
import { SectionController } from 'src/controllers/section.controller';
import { FooterController } from 'src/controllers/footer.controller';
import { ContentSectionService } from 'src/services/content-section.service';
import { SectionService } from 'src/services/section.service';
import { FooterService } from 'src/services/footer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Navbar.name, schema: NavbarSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: ContentSection.name, schema: ContentSectionSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Footer.name, schema: FooterSchema },
    ]),
  ],
  controllers: [
    NavbarController,
    BannerController,
    ContentSectionController,SectionController,FooterController
  ],
  providers: [
    NavbarService,
    BannerService,
    ContentSectionService,
    SectionService,
    FooterService,
  ],
  exports: [
    NavbarService,
    BannerService,
    ContentSectionService,
    SectionService,
    FooterService,
  ],
})
export class CmsModule {}
