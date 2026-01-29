import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FooterService } from '../services/footer.service';
import { CreateFooterDto } from '../dto/create-footer.dto';
import { UpdateFooterDto } from '../dto/update-footer.dto';

@ApiTags('footer')
@Controller('footer')
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  @Post()
  @ApiOperation({ summary: 'Create footer configuration' })
  @ApiResponse({ status: 201, description: 'Footer created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createFooterDto: CreateFooterDto) {
    return this.footerService.create(createFooterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get active footer configuration' })
  @ApiResponse({ status: 200, description: 'Active footer configuration' })
  @ApiResponse({ status: 404, description: 'No active footer found' })
  findActive() {
    return this.footerService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get footer by ID' })
  @ApiParam({ name: 'id', description: 'Footer ID' })
  @ApiResponse({ status: 200, description: 'Footer configuration' })
  @ApiResponse({ status: 404, description: 'Footer not found' })
  findOne(@Param('id') id: string) {
    return this.footerService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update footer configuration' })
  @ApiParam({ name: 'id', description: 'Footer ID' })
  @ApiResponse({ status: 200, description: 'Footer updated successfully' })
  @ApiResponse({ status: 404, description: 'Footer not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id') id: string,
    @Body() updateFooterDto: UpdateFooterDto,
  ) {
    return this.footerService.update(id, updateFooterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete footer configuration' })
  @ApiParam({ name: 'id', description: 'Footer ID' })
  @ApiResponse({ status: 204, description: 'Footer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Footer not found' })
  remove(@Param('id') id: string) {
    return this.footerService.remove(id);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle footer active status' })
  @ApiParam({ name: 'id', description: 'Footer ID' })
  @ApiResponse({ status: 200, description: 'Footer status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Footer not found' })
  toggleStatus(@Param('id') id: string) {
    return this.footerService.toggleStatus(id);
  }

  @Get('all/list')
  @ApiOperation({ summary: 'Get all footer configurations' })
  @ApiResponse({ status: 200, description: 'List of all footer configurations' })
  findAll() {
    return this.footerService.findAll();
  }
}