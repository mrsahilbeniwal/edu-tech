import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Journey, JourneyDocument } from '../schemas/journey.schema';
import { CreateJourneyDto, UpdateJourneyDto } from '../dto/journey.dto';

@Injectable()
export class JourneyService {
  constructor(
    @InjectModel(Journey.name) private journeyModel: Model<JourneyDocument>,
  ) {}

  async create(createJourneyDto: CreateJourneyDto): Promise<Journey> {
    const createdJourney = new this.journeyModel(createJourneyDto);
    return createdJourney.save();
  }

  async findAll(): Promise<Journey[]> {
    return this.journeyModel.find().sort({ year: 1 }).exec();
  }

  async findByYear(year: number): Promise<Journey[]> {
    return this.journeyModel.find({ year }).exec();
  }

  async findOne(id: string): Promise<Journey> {
    const journey = await this.journeyModel.findById(id).exec();
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return journey;
  }

  async update(id: string, updateJourneyDto: UpdateJourneyDto): Promise<Journey> {
    const updatedJourney = await this.journeyModel
      .findByIdAndUpdate(id, updateJourneyDto, { new: true })
      .exec();
    
    if (!updatedJourney) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return updatedJourney;
  }

  async remove(id: string): Promise<void> {
    const result = await this.journeyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
  }

  async getJourneyTimeline(): Promise<Journey[]> {
    return this.journeyModel.find().sort({ year: 1, createdAt: 1 }).exec();
  }
}