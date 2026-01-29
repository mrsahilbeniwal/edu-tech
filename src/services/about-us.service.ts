import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AboutUs, AboutUsDocument } from '../schemas/about-us.schema';
import { CreateAboutUsDto, UpdateAboutUsDto } from '../dto/about-us.dto';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectModel(AboutUs.name) private aboutUsModel: Model<AboutUsDocument>,
  ) {}

  async create(createAboutUsDto: CreateAboutUsDto): Promise<AboutUs> {
    try {
      const createdAboutUs = new this.aboutUsModel(createAboutUsDto);
      return await createdAboutUs.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('About Us entry already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<AboutUs[]> {
    return this.aboutUsModel
      .find()
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findActive(): Promise<AboutUs[]> {
    return this.aboutUsModel
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<AboutUs> {
    const aboutUs = await this.aboutUsModel.findById(id).exec();
    if (!aboutUs) {
      throw new NotFoundException(`About Us with ID ${id} not found`);
    }
    return aboutUs;
  }

  async update(id: string, updateAboutUsDto: UpdateAboutUsDto): Promise<AboutUs> {
    const updatedAboutUs = await this.aboutUsModel
      .findByIdAndUpdate(id, updateAboutUsDto, { new: true })
      .exec();
    
    if (!updatedAboutUs) {
      throw new NotFoundException(`About Us with ID ${id} not found`);
    }
    return updatedAboutUs;
  }

  async remove(id: string): Promise<AboutUs> {
    const deletedAboutUs = await this.aboutUsModel
      .findByIdAndDelete(id)
      .exec();
    
    if (!deletedAboutUs) {
      throw new NotFoundException(`About Us with ID ${id} not found`);
    }
    return deletedAboutUs;
  }

  async toggleStatus(id: string): Promise<AboutUs> {
    const aboutUs = await this.findOne(id);
    return this.update(id, { isActive: !aboutUs.isActive });
  }
}