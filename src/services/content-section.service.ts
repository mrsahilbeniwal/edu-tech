import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContentSection,
  ContentSectionDocument,
} from '../schemas/content-section.schema';
import { CreateContentSectionDto } from 'src/dto/create-content-section.dto';
import { UpdateContentSectionDto } from 'src/dto/update-content-section.dto';

@Injectable()
export class ContentSectionService {
  constructor(
    @InjectModel(ContentSection.name)
    private contentSectionModel: Model<ContentSectionDocument>,
  ) {}

  async create(
    createContentSectionDto: CreateContentSectionDto,
  ): Promise<ContentSection> {
    const createdSection = new this.contentSectionModel(
      createContentSectionDto,
    );
    return createdSection.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: ContentSection[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.contentSectionModel
        .find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ order: 1, createdAt: -1 })
        .exec(),
      this.contentSectionModel.countDocuments({ isActive: true }).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ContentSection> {
    const section = await this.contentSectionModel.findById(id).exec();
    if (!section) {
      throw new NotFoundException(`Content section with ID ${id} not found`);
    }
    return section;
  }

  async update(
    id: string,
    updateContentSectionDto: UpdateContentSectionDto,
  ): Promise<ContentSection> {
    const updatedSection = await this.contentSectionModel
      .findByIdAndUpdate(id, updateContentSectionDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedSection) {
      throw new NotFoundException(`Content section with ID ${id} not found`);
    }

    return updatedSection;
  }

  async updateContent(
    id: string,
    updateData: Partial<
      Pick<
        CreateContentSectionDto,
        'heading' | 'subheading' | 'description' | 'cards'
      >
    >,
  ): Promise<ContentSection> {
    const updatedSection = await this.contentSectionModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    if (!updatedSection) {
      throw new NotFoundException(`Content section with ID ${id} not found`);
    }

    return updatedSection;
  }

  async updateSettings(
    id: string,
    updateData: Partial<
      Pick<
        CreateContentSectionDto,
        | 'headingPosition'
        | 'contentPosition'
        | 'isSlideCards'
        | 'isGridCards'
        | 'backgroundColor'
        | 'order'
      >
    >,
  ): Promise<ContentSection> {
    const updatedSection = await this.contentSectionModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    if (!updatedSection) {
      throw new NotFoundException(`Content section with ID ${id} not found`);
    }

    return updatedSection;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.contentSectionModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Content section with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Content section deleted successfully',
    };
  }

  async toggleStatus(id: string): Promise<ContentSection> {
    const section = await this.contentSectionModel.findById(id).exec();
    if (!section) {
      throw new NotFoundException(`Content section with ID ${id} not found`);
    }
    section.isActive = !section.isActive;
    return section.save();
  }
}
