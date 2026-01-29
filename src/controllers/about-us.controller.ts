import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AboutUsService } from '../services/about-us.service';
import { CreateAboutUsDto, UpdateAboutUsDto } from '../dto/about-us.dto';
import { AboutUs } from '../schemas/about-us.schema';

@ApiTags('About Us')
@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new about us entry' })
  @ApiResponse({
    status: 201,
    description: 'About us entry created successfully',
    type: AboutUs,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'About us entry already exists' })
  @ApiBody({ type: CreateAboutUsDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createAboutUsDto: CreateAboutUsDto): Promise<AboutUs> {
    return this.aboutUsService.create(createAboutUsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all about us entries' })
  @ApiResponse({
    status: 200,
    description: 'List of all about us entries',
    type: [AboutUs],
  })
  async findAll(): Promise<AboutUs[]> {
    return this.aboutUsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active about us entries' })
  @ApiResponse({
    status: 200,
    description: 'List of active about us entries',
    type: [AboutUs],
  })
  async findActive(): Promise<AboutUs[]> {
    return this.aboutUsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific about us entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'About us entry found',
    type: AboutUs,
  })
  @ApiResponse({ status: 404, description: 'About us entry not found' })
  @ApiParam({ name: 'id', description: 'About us entry ID' })
  async findOne(@Param('id') id: string): Promise<AboutUs> {
    return this.aboutUsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an about us entry' })
  @ApiResponse({
    status: 200,
    description: 'About us entry updated successfully',
    type: AboutUs,
  })
  @ApiResponse({ status: 404, description: 'About us entry not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiParam({ name: 'id', description: 'About us entry ID' })
  @ApiBody({ type: UpdateAboutUsDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateAboutUsDto: UpdateAboutUsDto,
  ): Promise<AboutUs> {
    return this.aboutUsService.update(id, updateAboutUsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an about us entry' })
  @ApiResponse({
    status: 200,
    description: 'About us entry deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'About us entry not found' })
  @ApiParam({ name: 'id', description: 'About us entry ID' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<AboutUs> {
    return this.aboutUsService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle active status of an about us entry' })
  @ApiResponse({
    status: 200,
    description: 'About us entry status toggled successfully',
    type: AboutUs,
  })
  @ApiResponse({ status: 404, description: 'About us entry not found' })
  @ApiParam({ name: 'id', description: 'About us entry ID' })
  async toggleStatus(@Param('id') id: string): Promise<AboutUs> {
    return this.aboutUsService.toggleStatus(id);
  }
}