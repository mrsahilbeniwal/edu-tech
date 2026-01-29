import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Put,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContactService } from '../services/contact.service';
import { ContactSubmissionDto, ContactInfoDto } from '../dto/contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('info')
  @ApiOperation({
    summary: 'Get contact information',
    description: 'Retrieve phone number, email, and office address',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            phoneNumber: { type: 'string', example: '+1-800-123-4567' },
            email: { type: 'string', example: 'contact@edtech.com' },
            office: {
              type: 'string',
              example: '123 Education St, Learning City, LC 12345',
            },
          },
        },
      },
    },
  })
  async getContactInfo() {
    try {
      const contactInfo = await this.contactService.getContactInfo();
      return {
        success: true,
        data: contactInfo,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve contact information',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('submit')
  @ApiOperation({
    summary: 'Submit contact form',
    description: 'Submit a contact form with name, email, mobile, and message',
  })
  @ApiBody({ type: ContactSubmissionDto })
  @ApiResponse({
    status: 201,
    description: 'Contact form submitted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Thank you for contacting us! We will get back to you soon.',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            mobile: { type: 'string', example: '+1234567890' },
            submittedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async submitContactForm(@Body() contactSubmissionDto: ContactSubmissionDto) {
    try {
      const submission =
        await this.contactService.submitContactForm(contactSubmissionDto);
      return {
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        data: {
         
          name: submission.name,
          email: submission.email,
          mobile: submission.mobile,
          submittedAt: submission.submittedAt,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to submit contact form',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('submissions')
  @ApiOperation({
    summary: 'Get all contact submissions',
    description: 'Retrieve all contact form submissions (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact submissions retrieved successfully',
  })
  async getContactSubmissions() {
    try {
      const submissions = await this.contactService.getContactSubmissions();
      return {
        success: true,
        data: submissions,
        count: submissions.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve contact submissions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('info')
  @ApiOperation({
    summary: 'Update contact information',
    description: 'Update phone number, email, and office address (Admin only)',
  })
  @ApiBody({ type: ContactInfoDto })
  @ApiResponse({
    status: 200,
    description: 'Contact information updated successfully',
  })
  async updateContactInfo(@Body() contactInfoDto: ContactInfoDto) {
    try {
      const updatedInfo =
        await this.contactService.updateContactInfo(contactInfoDto);
      return {
        success: true,
        message: 'Contact information updated successfully',
        data: updatedInfo,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update contact information',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
