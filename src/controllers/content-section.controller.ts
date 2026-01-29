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
  HttpException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ContentSectionService } from '../services/content-section.service';
import { CreateContentSectionDto } from '../dto/create-content-section.dto';
import { UpdateContentSectionDto } from '../dto/update-content-section.dto';

@ApiTags('content-sections')
@Controller('content-sections')
export class ContentSectionController {
  constructor(private readonly contentSectionService: ContentSectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create content section' })
  @ApiResponse({
    status: 201,
    description: 'Content section created successfully',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createContentSectionDto: CreateContentSectionDto) {
    return this.contentSectionService.create(createContentSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active content sections' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of active content sections' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.contentSectionService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content section by ID' })
  @ApiParam({ name: 'id', description: 'Content section ID' })
  @ApiResponse({ status: 200, description: 'Content section details' })
  @ApiResponse({ status: 404, description: 'Content section not found' })
  findOne(@Param('id') id: string) {
    return this.contentSectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content section' })
  @ApiParam({ name: 'id', description: 'Content section ID' })
  @ApiResponse({
    status: 200,
    description: 'Content section updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Content section not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateContentSectionDto: UpdateContentSectionDto,
  ) {
    try {
      const updatedSection = await this.contentSectionService.update(
        id,
        updateContentSectionDto,
      );
      return {
        success: true,
        message: 'Content section updated successfully',
        data: updatedSection,
      };
    } catch (error) {
      if (error.name === 'CastError' || error.message.includes('not found')) {
        throw new HttpException(
          'Content section not found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        error.message || 'Failed to update content section',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/content')
  @ApiOperation({
    summary: 'Update only content fields (heading, description, cards)',
  })
  @ApiParam({ name: 'id', description: 'Content section ID' })
  @ApiResponse({
    status: 200,
    description: 'Content section content updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Content section not found' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateContent(
    @Param('id') id: string,
    @Body()
    updateData: Partial<
      Pick<
        CreateContentSectionDto,
        'heading' | 'subheading' | 'description' | 'cards'
      >
    >,
  ) {
    try {
      const updatedSection = await this.contentSectionService.updateContent(
        id,
        updateData,
      );
      return {
        success: true,
        message: 'Content section content updated successfully',
        data: updatedSection,
      };
    } catch (error) {
      if (error.name === 'CastError' || error.message.includes('not found')) {
        throw new HttpException(
          'Content section not found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        error.message || 'Failed to update content section content',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/settings')
  @ApiOperation({
    summary: 'Update only display settings (positions, colors, flags)',
  })
  @ApiParam({ name: 'id', description: 'Content section ID' })
  @ApiResponse({
    status: 200,
    description: 'Content section settings updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Content section not found' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateSettings(
    @Param('id') id: string,
    @Body()
    updateData: Partial<
      Pick<
        CreateContentSectionDto,
        | 'headingPosition'
        | 'contentPosition'
        | 'isSlideCards'
        | 'isGridCards'
        | 'backgroundColor'
        | 'order'
      >
    >,
  ) {
    try {
      const updatedSection = await this.contentSectionService.updateSettings(
        id,
        updateData,
      );
      return {
        success: true,
        message: 'Content section settings updated successfully',
        data: updatedSection,
      };
    } catch (error) {
      if (error.name === 'CastError' || error.message.includes('not found')) {
        throw new HttpException(
          'Content section not found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        error.message || 'Failed to update content section settings',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content section' })
  @ApiParam({ name: 'id', description: 'Content section ID' })
  @ApiResponse({
    status: 200,
    description: 'Content section deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Content section not found' })
  remove(@Param('id') id: string) {
    return this.contentSectionService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle content section active status' })
  @ApiParam({ name: 'id', description: 'Content section ID' })
  @ApiResponse({ status: 200, description: 'Content section status toggled' })
  @ApiResponse({ status: 404, description: 'Content section not found' })
  toggleStatus(@Param('id') id: string) {
    return this.contentSectionService.toggleStatus(id);
  }
}
