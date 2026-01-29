import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from '../controllers/contact.controller';
import { ContactService } from '../services/contact.service';
import { ContactInfo, ContactInfoSchema } from '../schemas/contact-info.schema';
import {
  ContactSubmission,
  ContactSubmissionSchema,
} from '../schemas/contact-submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactInfo.name, schema: ContactInfoSchema },
      { name: ContactSubmission.name, schema: ContactSubmissionSchema },
    ]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
