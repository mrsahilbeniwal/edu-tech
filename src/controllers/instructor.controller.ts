import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { InstructorService } from '../services/instructor.service';
import {
  CreateInstructorDto,
  UpdateInstructorDto,
  InstructorResponseDto,
} from '../dto/instructor.dto';

@ApiTags('instructors')
@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new instructor' })
  @ApiBody({ type: CreateInstructorDto })
  @ApiResponse({
    status: 201,
    description: 'Instructor created successfully',
    type: InstructorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async create(@Body() createInstructorDto: CreateInstructorDto) {
    return await this.instructorService.create(createInstructorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all instructors' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by instructor name',
  })
  @ApiQuery({
    name: 'designation',
    required: false,
    description: 'Filter by instructor designation',
  })
  @ApiResponse({
    status: 200,
    description: 'List of instructors retrieved successfully',
    type: [InstructorResponseDto],
  })
  async findAll(
    @Query('name') name?: string,
    @Query('designation') designation?: string,
  ) {
    if (name) {
      return await this.instructorService.findByName(name);
    }
    if (designation) {
      return await this.instructorService.findByDesignation(designation);
    }
    return await this.instructorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an instructor by ID' })
  @ApiParam({
    name: 'id',
    description: 'Instructor ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Instructor retrieved successfully',
    type: InstructorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Instructor not found',
  })
  async findOne(@Param('id') id: string) {
    return await this.instructorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an instructor' })
  @ApiParam({
    name: 'id',
    description: 'Instructor ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateInstructorDto })
  @ApiResponse({
    status: 200,
    description: 'Instructor updated successfully',
    type: InstructorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Instructor not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return await this.instructorService.update(id, updateInstructorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an instructor' })
  @ApiParam({
    name: 'id',
    description: 'Instructor ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 204,
    description: 'Instructor deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Instructor not found',
  })
  async remove(@Param('id') id: string) {
    await this.instructorService.remove(id);
  }
}
