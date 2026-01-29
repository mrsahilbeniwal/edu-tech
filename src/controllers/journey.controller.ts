// src/controllers/journey.controller.ts
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JourneyService } from '../services/journey.service';
import { CreateJourneyDto, UpdateJourneyDto } from '../dto/journey.dto';
import { Journey } from '../schemas/journey.schema';

@ApiTags('Journey')
@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new journey milestone' })
  @ApiBody({ type: CreateJourneyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Journey milestone created successfully',
    type: Journey,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createJourneyDto: CreateJourneyDto): Promise<Journey> {
    return this.journeyService.create(createJourneyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all journey milestones' })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filter by specific year',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journey milestones retrieved successfully',
    type: [Journey],
  })
  async findAll(@Query('year') year?: number): Promise<Journey[]> {
    if (year) {
      return this.journeyService.findByYear(year);
    }
    return this.journeyService.findAll();
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get complete journey timeline sorted by year' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journey timeline retrieved successfully',
    type: [Journey],
  })
  async getTimeline(): Promise<Journey[]> {
    return this.journeyService.getJourneyTimeline();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific journey milestone by ID' })
  @ApiParam({
    name: 'id',
    description: 'Journey milestone ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journey milestone retrieved successfully',
    type: Journey,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Journey milestone not found',
  })
  async findOne(@Param('id') id: string): Promise<Journey> {
    return this.journeyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a journey milestone' })
  @ApiParam({
    name: 'id',
    description: 'Journey milestone ID',
    type: String,
  })
  @ApiBody({ type: UpdateJourneyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journey milestone updated successfully',
    type: Journey,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Journey milestone not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateJourneyDto: UpdateJourneyDto,
  ): Promise<Journey> {
    return this.journeyService.update(id, updateJourneyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a journey milestone' })
  @ApiParam({
    name: 'id',
    description: 'Journey milestone ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journey milestone deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Journey milestone not found',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.journeyService.remove(id);
    return { message: 'Journey milestone deleted successfully' };
  }
}