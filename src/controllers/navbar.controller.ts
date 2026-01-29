import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NavbarService } from '../services/navbar.service';
import { CreateNavbarDto } from '../dto/create-navbar.dto';

@ApiTags('navbar')
@Controller('navbar')
export class NavbarController {
  constructor(private readonly navbarService: NavbarService) {}

  @Post()
  @ApiOperation({ summary: 'Create navbar configuration' })
  @ApiResponse({ status: 201, description: 'Navbar created successfully' })
  create(@Body() createNavbarDto: CreateNavbarDto) {
    return this.navbarService.create(createNavbarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get active navbar configuration' })
  @ApiResponse({ status: 200, description: 'Active navbar configuration' })
  findActive() {
    return this.navbarService.findActive();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all navbar configurations' })
  @ApiResponse({ status: 200, description: 'All navbar configurations' })
  findAll() {
    return this.navbarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get navbar by ID' })
  @ApiResponse({ status: 200, description: 'Navbar configuration' })
  @ApiParam({ name: 'id', description: 'Navbar ID' })
  findOne(@Param('id') id: string) {
    return this.navbarService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update complete navbar configuration',
    description:
      'Update all navbar fields (logo, logoAlt, menuItems, ctaButton, isActive) at once. This is your single endpoint to update everything.',
  })
  @ApiResponse({ status: 200, description: 'Navbar updated successfully' })
  @ApiParam({ name: 'id', description: 'Navbar ID' })
  updateComplete(
    @Param('id') id: string,
    @Body() createNavbarDto: CreateNavbarDto,
  ) {
    return this.navbarService.update(id, createNavbarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete navbar configuration' })
  @ApiResponse({ status: 200, description: 'Navbar deleted successfully' })
  @ApiParam({ name: 'id', description: 'Navbar ID' })
  remove(@Param('id') id: string) {
    return this.navbarService.remove(id);
  }
}
