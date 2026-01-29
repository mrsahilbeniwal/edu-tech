import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { Course } from '../schemas/course.schema';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async getAllCategories() {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ name: 1 });

    // Get course count for each category using aggregation for better performance
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        // Convert category._id to ObjectId for proper matching
        const categoryObjectId = new Types.ObjectId(String(category._id));

        const courseCount = await this.courseModel.countDocuments({
          categoryId: categoryObjectId,
          isActive: true,
        });

        // Debug log to check what's happening
        console.log(
          `Category: ${category.name}, ID: ${category._id}, Course Count: ${courseCount}`,
        );

        return {
          _id: category._id,
          name: category.name,
          description: category.description,
          image: category.image,
          slug: category.slug,
          courseCount,
        //   createdAt: category.createdAt,
        //   updatedAt: category.updatedAt,
        };
      }),
    );

    return {
      success: true,
      data: categoriesWithCounts,
      total: categoriesWithCounts.length,
    };
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoryModel.findOne({ slug, isActive: true });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Convert category._id to ObjectId for proper matching
    const categoryObjectId = new Types.ObjectId(String(category._id));

    const courseCount = await this.courseModel.countDocuments({
      categoryId: categoryObjectId,
      isActive: true,
    });

    // Debug log
    console.log(
      `Category: ${category.name}, ID: ${category._id}, Course Count: ${courseCount}`,
    );

    return {
      success: true,
      data: {
        ...category.toObject(),
        courseCount,
      },
    };
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = new this.categoryModel(createCategoryDto);
    await category.save();

    return {
      success: true,
      message: 'Category created successfully',
      data: category,
    };
  }

  async updateCategory(id: string, updateCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      success: true,
      message: 'Category updated successfully',
      data: category,
    };
  }

  async deleteCategory(id: string) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}
