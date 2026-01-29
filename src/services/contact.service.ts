import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContactInfo,
  ContactInfoDocument,
} from '../schemas/contact-info.schema';
import {
  ContactSubmission,
  ContactSubmissionDocument,
} from '../schemas/contact-submission.schema';
import { ContactSubmissionDto, ContactInfoDto } from '../dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactInfo.name)
    private contactInfoModel: Model<ContactInfoDocument>,
    @InjectModel(ContactSubmission.name)
    private contactSubmissionModel: Model<ContactSubmissionDocument>,
  ) {}

  async getContactInfo(): Promise<ContactInfo> {
    let contactInfo = await this.contactInfoModel.findOne({ isActive: true });

    // If no contact info exists, create default one
    if (!contactInfo) {
      const defaultContactInfo = new this.contactInfoModel({
        phoneNumber: '+1-800-EDTECH-1',
        email: 'contact@edtech.com',
        office: '123 Education Street, Learning City, LC 12345',
        isActive: true,
      });
      contactInfo = await defaultContactInfo.save();
    }

    return contactInfo;
  }

  async updateContactInfo(
    contactInfoDto: ContactInfoDto,
  ): Promise<ContactInfo> {
    let contactInfo = await this.contactInfoModel.findOne({ isActive: true });

    if (contactInfo) {
      // Update existing contact info
      contactInfo.phoneNumber = contactInfoDto.phoneNumber;
      contactInfo.email = contactInfoDto.email;
      contactInfo.office = contactInfoDto.office;
      return await contactInfo.save();
    } else {
      // Create new contact info
      const newContactInfo = new this.contactInfoModel({
        ...contactInfoDto,
        isActive: true,
      });
      return await newContactInfo.save();
    }
  }

  async submitContactForm(
    contactSubmissionDto: ContactSubmissionDto,
  ): Promise<ContactSubmission> {
    const submission = new this.contactSubmissionModel({
      ...contactSubmissionDto,
      submittedAt: new Date(),
      status: 'pending',
    });

    return await submission.save();
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.contactSubmissionModel
      .find()
      .sort({ submittedAt: -1 })
      .exec();
  }

  async updateSubmissionStatus(
    id: string,
    status: string,
  ): Promise<ContactSubmission> {
    const submission = await this.contactSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException('Contact submission not found');
    }

    submission.status = status;
    return await submission.save();
  }
}
