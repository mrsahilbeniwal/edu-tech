import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from '../schemas/banner.schema';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { UpdateBannerDto } from '../dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    createBannerDto.url =
      createBannerDto.buttons && createBannerDto.buttons.length > 0
        ? createBannerDto.buttons[0].url
        : '';
    const createdBanner = new this.bannerModel(createBannerDto);
    return createdBanner.save();
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    banners: Banner[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [banners, total] = await Promise.all([
      this.bannerModel
        .find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bannerModel.countDocuments({ isActive: true }),
    ]);

    return {
      banners,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return banner;
  }

  // Partial update (PATCH) - only updates provided fields
  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, updateBannerDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }
    return updatedBanner;
  }

  // Full replacement update (PUT) - replaces entire document
  async replaceUpdate(
    id: string,
    updateBannerDto: CreateBannerDto,
  ): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, updateBannerDto, {
        new: true,
        overwrite: true,
        runValidators: true,
      })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }
    return updatedBanner;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bannerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Banner not found');
    }
  }

  async toggleStatus(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    banner.isActive = !banner.isActive;
    return banner.save();
  }

  // Update status directly
  async updateStatus(id: string, isActive: boolean): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }
    return updatedBanner;
  }

  // Update order specifically
  async updateOrder(id: string, order: number): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, { order }, { new: true })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }
    return updatedBanner;
  }

  // Update only specific fields
  async updateField(
    id: string,
    field: keyof Banner,
    value: any,
  ): Promise<Banner> {
    const updateObj = { [field]: value };
    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, updateObj, { new: true })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }
    return updatedBanner;
  }

  // Bulk update multiple banners
  async bulkUpdate(
    filter: any,
    updateData: Partial<Banner>,
  ): Promise<{ modifiedCount: number }> {
    const result = await this.bannerModel.updateMany(filter, updateData).exec();

    return { modifiedCount: result.modifiedCount };
  }

  // Update banner image
  async updateBannerImage(
    id: string,
    backgroundImage: string,
    backgroundImageAlt?: string,
  ): Promise<Banner> {
    const updateData: any = { backgroundImage };
    if (backgroundImageAlt) {
      updateData.backgroundImageAlt = backgroundImageAlt;
    }

    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }
    return updatedBanner;
  }

  // Update text overlay
  async updateTextOverlay(
    id: string,
    textOverlay: UpdateBannerDto['textOverlay'],
  ): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, { textOverlay }, { new: true })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }
    return updatedBanner;
  }

  // Update buttons
  async updateButtons(
    id: string,
    buttons: UpdateBannerDto['buttons'],
  ): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findByIdAndUpdate(id, { buttons }, { new: true })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException('Banner not found');
    }
    return updatedBanner;
  }
}
