import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from '../schemas/testimonial.schema';
import { CreateTestimonialDto, UpdateTestimonialDto, TestimonialQueryDto } from '../dto/testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<TestimonialDocument>,
  ) {}

  async create(createTestimonialDto: CreateTestimonialDto): Promise<Testimonial> {
    try {
      const testimonial = new this.testimonialModel(createTestimonialDto);
      return await testimonial.save();
    } catch (error) {
      throw new BadRequestException('Failed to create testimonial');
    }
  }

  async findAll(query: TestimonialQueryDto): Promise<{
    testimonials: Testimonial[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, status, course, rating, featured, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    
    const filter: any = { isActive: true };
    
    if (status) filter.status = status;
    if (course) filter.course = { $regex: course, $options: 'i' };
    if (rating) filter.rating = rating;
    if (featured !== undefined) filter.featured = featured;

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [testimonials, total] = await Promise.all([
      this.testimonialModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.testimonialModel.countDocuments(filter).exec(),
    ]);

    return {
      testimonials,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialModel.findById(id).exec();
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<Testimonial> {
    const testimonial = await this.testimonialModel
      .findByIdAndUpdate(id, updateTestimonialDto, { new: true })
      .exec();
    
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    
    return testimonial;
  }

  async remove(id: string): Promise<void> {
    const result = await this.testimonialModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await this.testimonialModel
      .find({ status: 'approved', isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await this.testimonialModel
      .find({ status: 'approved', featured: true, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTestimonialsByCourse(course: string): Promise<Testimonial[]> {
    return await this.testimonialModel
      .find({ 
        course: { $regex: course, $options: 'i' }, 
        status: 'approved', 
        isActive: true 
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async approveTestimonial(id: string, approvedBy?: string): Promise<Testimonial> {
    const updateData: any = {
      status: 'approved',
      approvedAt: new Date(),
    };
    
    if (approvedBy) {
      updateData.approvedBy = approvedBy;
    }

    const testimonial = await this.testimonialModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    
    return testimonial;
  }

  async rejectTestimonial(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialModel
      .findByIdAndUpdate(id, { status: 'rejected' }, { new: true })
      .exec();
    
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    
    return testimonial;
  }

  async toggleFeatured(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialModel.findById(id).exec();
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    testimonial.featured = !testimonial.featured;
    return await testimonial.save();
  }

  async getStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    featured: number;
    averageRating: number;
  }> {
    const [total, approved, pending, rejected, featured, avgRating] = await Promise.all([
      this.testimonialModel.countDocuments({ isActive: true }),
      this.testimonialModel.countDocuments({ status: 'approved', isActive: true }),
      this.testimonialModel.countDocuments({ status: 'pending', isActive: true }),
      this.testimonialModel.countDocuments({ status: 'rejected', isActive: true }),
      this.testimonialModel.countDocuments({ featured: true, isActive: true }),
      this.testimonialModel.aggregate([
        { $match: { status: 'approved', isActive: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ])
    ]);

    return {
      total,
      approved,
      pending,
      rejected,
      featured,
      averageRating: avgRating[0]?.avgRating || 0,
    };
  }
}