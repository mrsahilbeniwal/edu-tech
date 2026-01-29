import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partner, PartnerDocument } from '../schemas/partner.schema';
import { CreatePartnerDto, UpdatePartnerDto } from '../dto/partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name) private partnerModel: Model<PartnerDocument>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    try {
      const createdPartner = new this.partnerModel(createPartnerDto);
      return await createdPartner.save();
    } catch (error) {
      throw new BadRequestException('Failed to create partner');
    }
  }

  async findAll(includeInactive: boolean = false): Promise<Partner[]> {
    const filter = includeInactive ? {} : { isActive: true };
    return await this.partnerModel
      .find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Partner> {
    const partner = await this.partnerModel.findById(id).exec();
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
    const updatedPartner = await this.partnerModel
      .findByIdAndUpdate(
        id,
        { ...updatePartnerDto, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .exec();

    if (!updatedPartner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    return updatedPartner;
  }

  async remove(id: string): Promise<void> {
    const result = await this.partnerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
  }

  async toggleStatus(id: string): Promise<Partner> {
    const partner = await this.findOne(id);
    return await this.update(id, { isActive: !partner.isActive });
  }

  async reorderPartners(partnerIds: string[]): Promise<Partner[]> {
    const updatePromises = partnerIds.map((id, index) =>
      this.update(id, { displayOrder: index })
    );
    
    return await Promise.all(updatePromises);
  }

  async getActivePartners(): Promise<Partner[]> {
    return await this.partnerModel
      .find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .select('name imageUrl website description displayOrder')
      .exec();
  }
}