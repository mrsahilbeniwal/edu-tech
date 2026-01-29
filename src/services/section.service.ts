import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section, SectionDocument } from '../schemas/section.schema';
import { CreateSectionDto } from '../dto/create-section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const createdSection = new this.sectionModel(createSectionDto);
    return createdSection.save();
  }

  async findAll(page = 1, limit = 10): Promise<{
    sections: Section[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [sections, total] = await Promise.all([
      this.sectionModel
        .find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.sectionModel.countDocuments({ isActive: true }),
    ]);

    return {
      sections,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.sectionModel.findById(id).exec();
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    return section;
  }

  async update(id: string, updateSectionDto: Partial<CreateSectionDto>): Promise<Section> {
    const updatedSection = await this.sectionModel
      .findByIdAndUpdate(id, updateSectionDto, { new: true })
      .exec();
    
    if (!updatedSection) {
      throw new NotFoundException('Section not found');
    }
    return updatedSection;
  }

  async remove(id: string): Promise<void> {
    const result = await this.sectionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Section not found');
    }
  }

  async toggleStatus(id: string): Promise<Section> {
    const section = await this.sectionModel.findById(id).exec();
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    section.isActive = !section.isActive;
    return section.save();
  }
}
