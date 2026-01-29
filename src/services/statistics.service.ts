import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Statistics, StatisticsDocument } from '../schemas/statistics.schema';
import {
  CreateStatisticsDto,
  UpdateStatisticsDto,
} from '../dto/statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Statistics.name)
    private statisticsModel: Model<StatisticsDocument>,
  ) {}

  async create(createStatisticsDto: CreateStatisticsDto): Promise<Statistics> {
    // Deactivate previous active statistics
    await this.statisticsModel.updateMany(
      { isActive: true },
      { isActive: false },
    );

    const createdStatistics = new this.statisticsModel({
      ...createStatisticsDto,
      isActive: true,
    });
    return createdStatistics.save();
  }

  async findAll(): Promise<Statistics[]> {
    return this.statisticsModel.find().sort({ createdAt: -1 }).exec();
  }

  async findActive(): Promise<Statistics> {
    const activeStats = await this.statisticsModel
      .findOne({ isActive: true })
      .exec();
    if (!activeStats) {
      // Return default statistics if none exist
      return {
        totalUsers: 0,
        totalInstructors: 0,
        countryReached: 'India',
        courseCompletionRate: 98,
        isActive: true,
      } as Statistics;
    }
    return activeStats;
  }

  async findOne(id: string): Promise<Statistics> {
    const statistics = await this.statisticsModel.findById(id).exec();
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
    return statistics;
  }

  async update(
    id: string,
    updateStatisticsDto: UpdateStatisticsDto,
  ): Promise<Statistics> {
    const updatedStatistics = await this.statisticsModel
      .findByIdAndUpdate(id, updateStatisticsDto, { new: true })
      .exec();

    if (!updatedStatistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
    return updatedStatistics;
  }

  async updateActive(
    updateStatisticsDto: UpdateStatisticsDto,
  ): Promise<Statistics> {
    const activeStats = await this.statisticsModel
      .findOne({ isActive: true })
      .exec();
    if (!activeStats) {
      throw new NotFoundException('No active statistics found');
    }

    return this.update(String(activeStats._id), updateStatisticsDto);
  }

  async remove(id: string): Promise<void> {
    const result = await this.statisticsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }
  }

  async getPlatformOverview(): Promise<{
    totalUsers: number;
    totalInstructors: number;
    countryReached: string;
    courseCompletionRate: number;
    
  }> {
    const activeStats = await this.findActive();
    return {
      totalUsers: activeStats.totalUsers,
      totalInstructors: activeStats.totalInstructors,
      countryReached: activeStats.countryReached,
      courseCompletionRate: activeStats.courseCompletionRate,
   
    };
  }
}
