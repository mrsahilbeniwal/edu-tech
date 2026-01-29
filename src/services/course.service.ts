import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from '../schemas/course.schema';
import { Category } from '../schemas/category.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { QueryCourseDto } from '../dto/query-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getAllCourses(queryDto: QueryCourseDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      level,
    } = queryDto;

    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (level) {
      filter.level = level;
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const courses = await this.courseModel
      .find(filter)
      .populate('categoryId', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await this.courseModel.countDocuments(filter);

    return {
      success: true,
      data: courses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getCoursesByCategory(categorySlug: string, queryDto: QueryCourseDto) {
    const category = await this.categoryModel.findOne({
      slug: categorySlug,
      isActive: true,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      level,
    } = queryDto;

    const filter: any = { categoryId: category._id, isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (level) {
      filter.level = level;
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const courses = await this.courseModel
      .find(filter)
      .populate('categoryId', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await this.courseModel.countDocuments(filter);

    return {
      success: true,
      data: courses,
      category: {
        name: category.name,
        description: category.description,
        slug: category.slug,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getCourseBySlug(slug: string) {
    const course = await this.courseModel
      .findOne({ slug, isActive: true })
      .populate('categoryId', 'name slug');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      data: course,
    };
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    // Ensure categoryId is converted to ObjectId if it's a string
    const courseData = {
      ...createCourseDto,
      categoryId: new Types.ObjectId(createCourseDto.categoryId),
    };

    const course = new this.courseModel(courseData);
    await course.save();

    return {
      success: true,
      message: 'Course created successfully',
      data: course,
    };
  }

  async updateCourse(id: string, updateCourseDto: CreateCourseDto) {
    // Ensure categoryId is converted to ObjectId if it's being updated
    const updateData = {
      ...updateCourseDto,
      ...(updateCourseDto.categoryId && {
        categoryId: new Types.ObjectId(updateCourseDto.categoryId),
      }),
    };

    const course = await this.courseModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      message: 'Course updated successfully',
      data: course,
    };
  }

  async deleteCourse(id: string) {
    const course = await this.courseModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      message: 'Course deleted successfully',
    };
  }

  // New methods for enhanced functionality
  async getCourseSyllabus(id: string) {
    const course = await this.courseModel
      .findOne({ _id: id, isActive: true })
      .select('title description syllabus totalPhases marketTrends targetCompanies marketOverview')
      .populate('categoryId', 'name slug');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      data: {
        courseId: course._id,
        title: course.title,
        description: course.description,
        category: course.categoryId,
        syllabus: course.syllabus,
        totalPhases: course.totalPhases,
        marketTrends: course.marketTrends,
        targetCompanies: course.targetCompanies,
        marketOverview: course.marketOverview,
      },
    };
  }

  async getCourseProjects(id: string) {
    const course = await this.courseModel
      .findOne({ _id: id, isActive: true })
      .select('title description projects totalProjects targetCompanies')
      .populate('categoryId', 'name slug');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Separate main projects from bonus projects
    const mainProjects = course.projects.filter(project => !project.isBonus);
    const bonusProjects = course.projects.filter(project => project.isBonus);

    return {
      success: true,
      data: {
        courseId: course._id,
        title: course.title,
        description: course.description,
        category: course.categoryId,
        totalProjects: course.totalProjects,
        targetCompanies: course.targetCompanies,
        mainProjects: mainProjects,
        bonusProjects: bonusProjects,
        projectStats: {
          totalProjects: course.projects.length,
          mainProjects: mainProjects.length,
          bonusProjects: bonusProjects.length,
          difficultyBreakdown: {
            beginner: course.projects.filter(p => p.difficulty === 'Beginner').length,
            intermediate: course.projects.filter(p => p.difficulty === 'Intermediate').length,
            advanced: course.projects.filter(p => p.difficulty === 'Advanced').length,
          },
        },
      },
    };
  }

  async getCoursePhases(id: string) {
    const course = await this.courseModel
      .findOne({ _id: id, isActive: true })
      .select('title description phases totalPhases duration level')
      .populate('categoryId', 'name slug');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      data: {
        courseId: course._id,
        title: course.title,
        description: course.description,
        category: course.categoryId,
        totalDuration: course.duration,
        level: course.level,
        totalPhases: course.totalPhases,
        phases: course.phases,
        phaseStats: {
          totalPhases: course.phases.length,
          estimatedDuration: course.phases.reduce((total, phase) => {
            // Extract numeric value from duration string (e.g., "4-6 weeks" -> 5)
            const durationMatch = phase.duration.match(/(\d+)-?(\d+)?/);
            if (durationMatch) {
              const min = parseInt(durationMatch[1]);
              const max = durationMatch[2] ? parseInt(durationMatch[2]) : min;
              return total + Math.ceil((min + max) / 2);
            }
            return total;
          }, 0),
          totalFocusAreas: course.phases.reduce((total, phase) => total + phase.focusAreas.length, 0),
        },
      },
    };
  }

  async getCourseMarketInsights(id: string) {
    const course = await this.courseModel
      .findOne({ _id: id, isActive: true })
      .select('title description marketTrends salaryInfo targetCompanies marketOverview careerOutlook')
      .populate('categoryId', 'name slug');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      data: {
        courseId: course._id,
        title: course.title,
        description: course.description,
        category: course.categoryId,
        marketOverview: course.marketOverview,
        careerOutlook: course.careerOutlook,
        targetCompanies: course.targetCompanies,
        marketTrends: course.marketTrends,
        salaryInfo: course.salaryInfo,
        insights: {
          totalTrends: course.marketTrends.length,
          highImpactTrends: course.marketTrends.filter(trend => trend.impact === 'High').length,
          avgSalaryRange: course.salaryInfo.length > 0 ? {
            min: Math.min(...course.salaryInfo.map(s => s.minSalary)),
            max: Math.max(...course.salaryInfo.map(s => s.maxSalary)),
            regions: course.salaryInfo.map(s => s.region),
          } : null,
        },
      },
    };
  }

  async getCourseFullDetails(id: string) {
    const course = await this.courseModel
      .findOne({ _id: id, isActive: true })
      .populate('categoryId', 'name slug');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      success: true,
      data: {
        ...course.toObject(),
        stats: {
          totalPhases: course.phases.length,
          totalProjects: course.projects.length,
          totalMarketTrends: course.marketTrends.length,
          totalSyllabus: course.syllabus.length,
          projectsByDifficulty: {
            beginner: course.projects.filter(p => p.difficulty === 'Beginner').length,
            intermediate: course.projects.filter(p => p.difficulty === 'Intermediate').length,
            advanced: course.projects.filter(p => p.difficulty === 'Advanced').length,
          },
        },
      },
    };
  }
}