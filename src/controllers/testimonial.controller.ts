import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TestimonialService } from '../services/testimonial.service';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
  TestimonialQueryDto,
} from '../dto/testimonial.dto';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new testimonial' })
  @ApiResponse({ status: 201, description: 'Testimonial created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialService.create(createTestimonialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all testimonials with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Testimonials retrieved successfully',
  })
  findAll(@Query() query: TestimonialQueryDto) {
    return this.testimonialService.findAll(query);
  }

  @Get('approved')
  @ApiOperation({ summary: 'Get all approved testimonials' })
  @ApiResponse({
    status: 200,
    description: 'Approved testimonials retrieved successfully',
  })
  getApproved() {
    return this.testimonialService.getApprovedTestimonials();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get all featured testimonials' })
  @ApiResponse({
    status: 200,
    description: 'Featured testimonials retrieved successfully',
  })
  getFeatured() {
    return this.testimonialService.getFeaturedTestimonials();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get testimonials statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  getStats() {
    return this.testimonialService.getStats();
  }

  @Get('course/:course')
  @ApiOperation({ summary: 'Get testimonials by course' })
  @ApiResponse({
    status: 200,
    description: 'Course testimonials retrieved successfully',
  })
  getByCourse(@Param('course') course: string) {
    return this.testimonialService.getTestimonialsByCourse(course);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get testimonial by ID' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  findOne(@Param('id') id: string) {
    return this.testimonialService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial updated successfully' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.testimonialService.update(id, updateTestimonialDto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve testimonial' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial approved successfully',
  })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  approve(@Param('id') id: string, @Body() body?: { approvedBy?: string }) {
    return this.testimonialService.approveTestimonial(id, body?.approvedBy);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject testimonial' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial rejected successfully',
  })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  reject(@Param('id') id: string) {
    return this.testimonialService.rejectTestimonial(id);
  }

  @Patch(':id/toggle-featured')
  @ApiOperation({ summary: 'Toggle testimonial featured status' })
  @ApiResponse({
    status: 200,
    description: 'Featured status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  toggleFeatured(@Param('id') id: string) {
    return this.testimonialService.toggleFeatured(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete testimonial' })
  @ApiResponse({ status: 204, description: 'Testimonial deleted successfully' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  remove(@Param('id') id: string) {
    return this.testimonialService.remove(id);
  }
}
