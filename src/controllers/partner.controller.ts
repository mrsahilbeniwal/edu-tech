import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PartnerService } from '../services/partner.service';
import { CreatePartnerDto, UpdatePartnerDto, PartnerResponseDto } from '../dto/partner.dto';

@ApiTags('Partners')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiResponse({
    status: 201,
    description: 'Partner created successfully',
    type: PartnerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth()
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    return await this.partnerService.create(createPartnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all partners' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Include inactive partners in the response',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Partners retrieved successfully',
    type: [PartnerResponseDto],
  })
  async findAll(@Query('includeInactive') includeInactive?: boolean) {
    return await this.partnerService.findAll(includeInactive);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active partners for public display' })
  @ApiResponse({
    status: 200,
    description: 'Active partners retrieved successfully',
    type: [PartnerResponseDto],
  })
  async getActivePartners() {
    return await this.partnerService.getActivePartners();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a partner by ID' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({
    status: 200,
    description: 'Partner retrieved successfully',
    type: PartnerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async findOne(@Param('id') id: string) {
    return await this.partnerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a partner' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({
    status: 200,
    description: 'Partner updated successfully',
    type: PartnerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return await this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a partner' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 204, description: 'Partner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    await this.partnerService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle partner active/inactive status' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({
    status: 200,
    description: 'Partner status toggled successfully',
    type: PartnerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  @ApiBearerAuth()
  async toggleStatus(@Param('id') id: string) {
    return await this.partnerService.toggleStatus(id);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reorder partners by providing array of IDs' })
  @ApiResponse({
    status: 200,
    description: 'Partners reordered successfully',
    type: [PartnerResponseDto],
  })
  @ApiBearerAuth()
  async reorderPartners(@Body('partnerIds') partnerIds: string[]) {
    return await this.partnerService.reorderPartners(partnerIds);
  }
}