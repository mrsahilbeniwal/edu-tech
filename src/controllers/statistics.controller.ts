// src/controllers/statistics.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { StatisticsService } from '../services/statistics.service';
import { CreateStatisticsDto, UpdateStatisticsDto } from '../dto/statistics.dto';
import { Statistics } from '../schemas/statistics.schema';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create/Update platform statistics',
    description: 'Creates new statistics entry and sets it as active. Previous active statistics will be deactivated.'
  })
  @ApiBody({ type: CreateStatisticsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Statistics created successfully',
    type: Statistics,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createStatisticsDto: CreateStatisticsDto): Promise<Statistics> {
    return this.statisticsService.create(createStatisticsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all statistics records' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All statistics records retrieved successfully',
    type: [Statistics],
  })
  async findAll(): Promise<Statistics[]> {
    return this.statisticsService.findAll();
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Get current active platform statistics',
    description: 'Returns the currently active statistics showing total users, instructors, country reached, and completion rate'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active statistics retrieved successfully',
    type: Statistics,
  })
  async getActive(): Promise<Statistics> {
    return this.statisticsService.findActive();
  }

  @Get('overview')
  @ApiOperation({ 
    summary: 'Get platform overview with key metrics',
    description: 'Returns a comprehensive overview of platform statistics including last updated timestamp'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Platform overview retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', example: 10000 },
        totalInstructors: { type: 'number', example: 250 },
        countryReached: { type: 'string', example: 'India' },
        courseCompletionRate: { type: 'number', example: 98 },
        lastUpdated: { type: 'string', format: 'date-time' }
      }
    }
  })
  async getPlatformOverview(): Promise<{
    totalUsers: number;
    totalInstructors: number;
    countryReached: string;
    courseCompletionRate: number;

  }> {
    return this.statisticsService.getPlatformOverview();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific statistics record by ID' })
  @ApiParam({
    name: 'id',
    description: 'Statistics record ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics record retrieved successfully',
    type: Statistics,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Statistics record not found',
  })
  async findOne(@Param('id') id: string): Promise<Statistics> {
    return this.statisticsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update specific statistics record' })
  @ApiParam({
    name: 'id',
    description: 'Statistics record ID',
    type: String,
  })
  @ApiBody({ type: UpdateStatisticsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics record updated successfully',
    type: Statistics,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Statistics record not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateStatisticsDto: UpdateStatisticsDto,
  ): Promise<Statistics> {
    return this.statisticsService.update(id, updateStatisticsDto);
  }

  @Patch('active/update')
  @ApiOperation({ 
    summary: 'Update current active statistics',
    description: 'Updates the currently active statistics record directly'
  })
  @ApiBody({ type: UpdateStatisticsDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active statistics updated successfully',
    type: Statistics,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No active statistics found',
  })
  async updateActive(@Body() updateStatisticsDto: UpdateStatisticsDto): Promise<Statistics> {
    return this.statisticsService.updateActive(updateStatisticsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete statistics record' })
  @ApiParam({
    name: 'id',
    description: 'Statistics record ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics record deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Statistics record not found',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.statisticsService.remove(id);
    return { message: 'Statistics record deleted successfully' };
  }
}