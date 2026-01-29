import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Footer, FooterDocument } from '../schemas/footer.schema';
import { CreateFooterDto } from '../dto/create-footer.dto';
import { UpdateFooterDto } from '../dto/update-footer.dto';

@Injectable()
export class FooterService {
  constructor(
    @InjectModel(Footer.name) private footerModel: Model<FooterDocument>,
  ) {}

  async create(createFooterDto: CreateFooterDto): Promise<Footer> {
    try {
      // Deactivate other footers when creating a new active one
      if (createFooterDto.isActive !== false) {
        await this.footerModel.updateMany({}, { isActive: false });
      }

      const createdFooter = new this.footerModel(createFooterDto);
      return await createdFooter.save();
    } catch (error) {
      throw new BadRequestException(`Failed to create footer configuration: ${error.message}`);
    }
  }

  async findAll(): Promise<Footer[]> {
    return await this.footerModel.find().sort({ createdAt: -1 }).exec();
  }

  async findActive(): Promise<Footer> {
    const footer = await this.footerModel.findOne({ isActive: true }).exec();
    if (!footer) {
      throw new NotFoundException('No active footer found');
    }
    return footer;
  }

  async findOne(id: string): Promise<Footer> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid footer ID format');
    }

    const footer = await this.footerModel.findById(id).exec();
    if (!footer) {
      throw new NotFoundException(`Footer with ID ${id} not found`);
    }
    return footer;
  }

  async update(
    id: string,
    updateFooterDto: UpdateFooterDto,
  ): Promise<Footer> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid footer ID format');
    }

    try {
      // If setting this footer as active, deactivate others
      if (updateFooterDto.isActive === true) {
        await this.footerModel.updateMany(
          { _id: { $ne: id } },
          { isActive: false },
        );
      }

      const updatedFooter = await this.footerModel
        .findByIdAndUpdate(id, updateFooterDto, { 
          new: true,
          runValidators: true 
        })
        .exec();

      if (!updatedFooter) {
        throw new NotFoundException(`Footer with ID ${id} not found`);
      }
      
      return updatedFooter;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update footer configuration');
    }
  }

  async remove(id: string): Promise<void> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid footer ID format');
    }

    const result = await this.footerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Footer with ID ${id} not found`);
    }
  }

  async toggleStatus(id: string): Promise<Footer> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid footer ID format');
    }

    const footer = await this.footerModel.findById(id).exec();
    if (!footer) {
      throw new NotFoundException(`Footer with ID ${id} not found`);
    }

    // If activating this footer, deactivate others
    if (!footer.isActive) {
      await this.footerModel.updateMany(
        { _id: { $ne: id } },
        { isActive: false },
      );
    }

    footer.isActive = !footer.isActive;
    return await footer.save();
  }
}