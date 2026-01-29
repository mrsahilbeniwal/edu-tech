import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { UpdateBannerDto } from '../dto/update-banner.dto';

@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @ApiOperation({ summary: 'Create banner' })
  @ApiResponse({ status: 201, description: 'Banner created successfully' })
  @ApiBody({ type: CreateBannerDto })
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active banners' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of active banners' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.bannerService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  @ApiResponse({ status: 200, description: 'Banner details' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  // Partial update using PATCH (your existing endpoint - enhanced)
  @Patch(':id')
  @ApiOperation({ summary: 'Partially update banner' })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiBody({ type: UpdateBannerDto })
  update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannerService.update(id, updateBannerDto);
  }

  // Full update using PUT (new endpoint)
  @Put(':id')
  @ApiOperation({ summary: 'Fully update banner (replace entire banner)' })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiBody({ type: CreateBannerDto })
  replaceUpdate(
    @Param('id') id: string,
    @Body() updateBannerDto: CreateBannerDto,
  ) {
    return this.bannerService.replaceUpdate(id, updateBannerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete banner' })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle banner active status' })
  @ApiResponse({ status: 200, description: 'Banner status toggled' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  toggleStatus(@Param('id') id: string) {
    return this.bannerService.toggleStatus(id);
  }

  // Additional useful endpoints for banner management
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate banner' })
  @ApiResponse({ status: 200, description: 'Banner activated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  activate(@Param('id') id: string) {
    return this.bannerService.updateStatus(id, true);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate banner' })
  @ApiResponse({ status: 200, description: 'Banner deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  deactivate(@Param('id') id: string) {
    return this.bannerService.updateStatus(id, false);
  }

  @Patch(':id/order')
  @ApiOperation({ summary: 'Update banner order' })
  @ApiResponse({ status: 200, description: 'Banner order updated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  updateOrder(
    @Param('id') id: string,
    @Body() body: { order: number },
  ) {
    return this.bannerService.updateOrder(id, body.order);
  }
}