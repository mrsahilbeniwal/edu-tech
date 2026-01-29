import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { QueryCourseDto } from '../dto/query-course.dto';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of courses with pagination info',
  })
  async getAllCourses(@Query() queryDto: QueryCourseDto) {
    return this.courseService.getAllCourses(queryDto);
  }

  @Get('category/:categorySlug')
  @ApiOperation({ summary: 'Get courses by category' })
  @ApiParam({ name: 'categorySlug', description: 'Category slug' })
  @ApiResponse({ status: 200, description: 'List of courses in the category' })
  async getCoursesByCategory(
    @Param('categorySlug') categorySlug: string,
    @Query() queryDto: QueryCourseDto,
  ) {
    return this.courseService.getCoursesByCategory(categorySlug, queryDto);
  }

  @Get(':id/syllabus')
  @ApiOperation({ summary: 'Get course syllabus by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course syllabus details' })
  async getCourseSyllabus(@Param('id') id: string) {
    return this.courseService.getCourseSyllabus(id);
  }

  @Get(':id/projects')
  @ApiOperation({ summary: 'Get course projects by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course projects with statistics' })
  async getCourseProjects(@Param('id') id: string) {
    return this.courseService.getCourseProjects(id);
  }

  @Get(':id/phases')
  @ApiOperation({ summary: 'Get course phases by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course phases with statistics' })
  async getCoursePhases(@Param('id') id: string) {
    return this.courseService.getCoursePhases(id);
  }

  @Get(':id/market-insights')
  @ApiOperation({ summary: 'Get course market insights by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course market insights and trends' })
  async getCourseMarketInsights(@Param('id') id: string) {
    return this.courseService.getCourseMarketInsights(id);
  }

  @Get(':id/full-details')
  @ApiOperation({ summary: 'Get complete course details by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Complete course details with statistics' })
  async getCourseFullDetails(@Param('id') id: string) {
    return this.courseService.getCourseFullDetails(id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get course by slug' })
  @ApiParam({ name: 'slug', description: 'Course slug' })
  @ApiResponse({ status: 200, description: 'Course details' })
  async getCourseBySlug(@Param('slug') slug: string) {
    return this.courseService.getCourseBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: CreateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}