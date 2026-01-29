import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Navbar, NavbarDocument } from '../schemas/navbar.schema';
import { CreateNavbarDto } from '../dto/create-navbar.dto';

@Injectable()
export class NavbarService {
  constructor(
    @InjectModel(Navbar.name) private navbarModel: Model<NavbarDocument>,
  ) {}

  async create(createNavbarDto: CreateNavbarDto): Promise<Navbar> {
    // Deactivate other navbars when creating a new active one
    if (createNavbarDto.isActive !== false) {
      await this.navbarModel.updateMany({}, { isActive: false });
    }

    const createdNavbar = new this.navbarModel(createNavbarDto);
    return createdNavbar.save();
  }

  async findActive(): Promise<Navbar> {
    const navbar = await this.navbarModel.findOne({ isActive: true }).exec();
    if (!navbar) {
      throw new NotFoundException('No active navbar found');
    }
    return navbar;
  }

  async findAll(): Promise<Navbar[]> {
    return this.navbarModel.find().exec();
  }

  async findOne(id: string): Promise<Navbar> {
    const navbar = await this.navbarModel.findById(id).exec();
    if (!navbar) {
      throw new NotFoundException('Navbar not found');
    }
    return navbar;
  }

  async update(
    id: string,
    updateNavbarDto: Partial<CreateNavbarDto> | CreateNavbarDto,
  ): Promise<Navbar> {
    // If setting this navbar as active, deactivate others
    if (updateNavbarDto.isActive === true) {
      await this.navbarModel.updateMany(
        { _id: { $ne: id } },
        { isActive: false },
      );
    }

    const updatedNavbar = await this.navbarModel
      .findByIdAndUpdate(id, updateNavbarDto, { new: true })
      .exec();

    if (!updatedNavbar) {
      throw new NotFoundException('Navbar not found');
    }
    return updatedNavbar;
  }

  async remove(id: string): Promise<void> {
    const result = await this.navbarModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Navbar not found');
    }
  }
}
