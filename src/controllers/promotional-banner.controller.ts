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
  ParseUUIDPipe,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { PromotionalBannerService } from '../services/promotional-banner.service';
import {
  CreatePromotionalBannerDto,
  UpdatePromotionalBannerDto,
  PromotionalBannerQueryDto,
} from '../dto/promotional-banner.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('promotional-banners')
@Controller('promotional-banners')
export class PromotionalBannerController {
  constructor(
    private readonly promotionalBannerService: PromotionalBannerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new promotional banner' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Banner created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body() createPromotionalBannerDto: CreatePromotionalBannerDto) {
    return this.promotionalBannerService.create(createPromotionalBannerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all promotional banners with filtering and pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Banners retrieved successfully',
  })
  findAll(@Query() query: PromotionalBannerQueryDto) {
    return this.promotionalBannerService.findAll(query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active promotional banners' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active banners retrieved successfully',
  })
  findActive() {
    return this.promotionalBannerService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a promotional banner by ID' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Banner retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  findOne(@Param('id') id: string) {
    return this.promotionalBannerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a promotional banner' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Banner updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id') id: string,
    @Body() updatePromotionalBannerDto: UpdatePromotionalBannerDto,
  ) {
    return this.promotionalBannerService.update(id, updatePromotionalBannerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a promotional banner' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Banner deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  remove(@Param('id') id: string) {
    return this.promotionalBannerService.remove(id);
  }

  @Put(':id/stats/:action')
  @ApiOperation({ summary: 'Update banner statistics (impression or click)' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiParam({
    name: 'action',
    enum: ['impression', 'click'],
    description: 'Action type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stats updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  updateStats(
    @Param('id') id: string,
    @Param('action') action: 'impression' | 'click',
  ) {
    return this.promotionalBannerService.updateStats(id, action);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get banner statistics' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stats retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  getStats(@Param('id') id: string) {
    return this.promotionalBannerService.getStats(id);
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle banner active status' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status toggled successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner not found',
  })
  toggleStatus(@Param('id') id: string) {
    return this.promotionalBannerService.toggleStatus(id);
  }
}
