import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor, InstructorDocument } from '../schemas/instructor.schema';
import { CreateInstructorDto, UpdateInstructorDto } from '../dto/instructor.dto';

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel(Instructor.name)
    private instructorModel: Model<InstructorDocument>,
  ) {}

  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    try {
      const instructor = new this.instructorModel(createInstructorDto);
      return await instructor.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'Instructor with this name already exists',
        );
      }
      throw new BadRequestException('Failed to create instructor');
    }
  }

  async findAll(): Promise<Instructor[]> {
    return await this.instructorModel.find().exec();
  }

  async findOne(id: string): Promise<Instructor> {
    const instructor = await this.instructorModel.findById(id).exec();
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return instructor;
  }

  async update(
    id: string,
    updateInstructorDto: UpdateInstructorDto,
  ): Promise<Instructor> {
    try {
      const instructor = await this.instructorModel
        .findByIdAndUpdate(id, updateInstructorDto, { new: true })
        .exec();

      if (!instructor) {
        throw new NotFoundException(`Instructor with ID ${id} not found`);
      }

      return instructor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update instructor');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.instructorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
  }

  async findByName(name: string): Promise<Instructor[]> {
    return await this.instructorModel
      .find({ name: { $regex: name, $options: 'i' } })
      .exec();
  }

  async findByDesignation(designation: string): Promise<Instructor[]> {
    return await this.instructorModel
      .find({ designation: { $regex: designation, $options: 'i' } })
      .exec();
  }
}
