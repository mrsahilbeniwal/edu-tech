import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PromotionalBanner,
  PromotionalBannerDocument,
} from '../schemas/promotional-banner.schema';
import {
  CreatePromotionalBannerDto,
  UpdatePromotionalBannerDto,
  PromotionalBannerQueryDto,
} from '../dto/promotional-banner.dto';

@Injectable()
export class PromotionalBannerService {
  constructor(
    @InjectModel(PromotionalBanner.name)
    private promotionalBannerModel: Model<PromotionalBannerDocument>,
  ) {}

  async create(
    createPromotionalBannerDto: CreatePromotionalBannerDto,
  ): Promise<PromotionalBanner> {
    // Validate date range
    if (
      createPromotionalBannerDto.startDate &&
      createPromotionalBannerDto.endDate
    ) {
      if (
        new Date(createPromotionalBannerDto.startDate) >=
        new Date(createPromotionalBannerDto.endDate)
      ) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    const createdBanner = new this.promotionalBannerModel(
      createPromotionalBannerDto,
    );
    return createdBanner.save();
  }

  async findAll(query: PromotionalBannerQueryDto): Promise<{
    banners: PromotionalBanner[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'priority',
      sortOrder = 'desc',
      ...filters
    } = query;

    // Build filter object
    const filterObj: any = {};

    if (filters.isActive !== undefined) {
      filterObj.isActive = filters.isActive;
    }

    if (filters.displayType) {
      filterObj.displayType = filters.displayType;
    }

    if (filters.position) {
      filterObj.position = filters.position;
    }

    if (filters.targetAudience) {
      filterObj.targetAudience = new RegExp(filters.targetAudience, 'i');
    }

    if (filters.deviceType) {
      filterObj.deviceType = filters.deviceType;
    }

    // Add date range filter for active banners
    const currentDate = new Date();
    filterObj.$or = [
      { startDate: { $exists: false }, endDate: { $exists: false } },
      { startDate: { $lte: currentDate }, endDate: { $gte: currentDate } },
      { startDate: { $exists: false }, endDate: { $gte: currentDate } },
      { startDate: { $lte: currentDate }, endDate: { $exists: false } },
    ];

    const skip = (page - 1) * limit;
    const sortObj: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [banners, total] = await Promise.all([
      this.promotionalBannerModel
        .find(filterObj)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.promotionalBannerModel.countDocuments(filterObj).exec(),
    ]);

    return {
      banners,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findActive(): Promise<PromotionalBanner[]> {
    return this.promotionalBannerModel
      .find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<PromotionalBanner> {
    const banner = await this.promotionalBannerModel.findById(id).exec();
    if (!banner) {
      throw new NotFoundException(`Promotional banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(
    id: string,
    updatePromotionalBannerDto: UpdatePromotionalBannerDto,
  ): Promise<PromotionalBanner> {
    // Validate date range if both dates are provided
    if (
      updatePromotionalBannerDto.startDate &&
      updatePromotionalBannerDto.endDate
    ) {
      if (
        new Date(updatePromotionalBannerDto.startDate) >=
        new Date(updatePromotionalBannerDto.endDate)
      ) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    const updatedBanner = await this.promotionalBannerModel
      .findByIdAndUpdate(id, updatePromotionalBannerDto, { new: true })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException(`Promotional banner with ID ${id} not found`);
    }

    return updatedBanner;
  }

  async remove(id: string): Promise<void> {
    const result = await this.promotionalBannerModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(`Promotional banner with ID ${id} not found`);
    }
  }

  async updateStats(id: string, action: 'impression' | 'click'): Promise<void> {
    const updateField = action === 'impression' ? 'impressions' : 'clicks';

    const result = await this.promotionalBannerModel
      .findByIdAndUpdate(id, { $inc: { [updateField]: 1 } })
      .exec();

    if (!result) {
      throw new NotFoundException(`Promotional banner with ID ${id} not found`);
    }
  }

  async getStats(
    id: string,
  ): Promise<{ impressions: number; clicks: number; ctr: number }> {
    const banner = await this.findOne(id);

    const ctr =
      banner.impressions > 0 ? (banner.clicks / banner.impressions) * 100 : 0;

    return {
      impressions: banner.impressions,
      clicks: banner.clicks,
      ctr: parseFloat(ctr.toFixed(2)),
    };
  }

  async toggleStatus(id: string): Promise<PromotionalBanner> {
    const banner = await this.findOne(id);

    const updatedBanner = await this.promotionalBannerModel
      .findByIdAndUpdate(id, { isActive: !banner.isActive }, { new: true })
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException(`Promotional banner with ID ${id} not found`);
    }

    return updatedBanner;
  }
}
