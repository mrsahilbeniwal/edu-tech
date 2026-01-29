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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  EnquiryFormDto,
  UserQueryDto,
  AddToCartDto,
  RemoveFromCartDto,
  UpdateCartDto,
} from '../dto/user.dto';
import { User } from '../schemas/user.schema';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('enquiry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit enquiry form',
    description:
      'Submit enquiry form. If user exists (by phone), marks as important and updates info. If new user, creates account.',
  })
  @ApiResponse({
    status: 200,
    description: 'Enquiry form submitted successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async submitEnquiry(@Body() enquiryFormDto: EnquiryFormDto): Promise<{
    message: string;
    user: User;
    isExistingUser: boolean;
  }> {
    const existingUser = await this.userService.findByPhone(
      enquiryFormDto.phone,
    );
    const user = await this.userService.submitEnquiryForm(enquiryFormDto);

    return {
      message: existingUser
        ? 'Thank you for your continued interest! Your enquiry has been updated.'
        : 'Thank you for your enquiry! We will contact you soon.',
      user,
      isExistingUser: !!existingUser,
    };
  }

  // Cart Management Endpoints
  @Post(':id/cart/add')
  @ApiOperation({ summary: 'Add course to user cart' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Course added to cart successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Course already in cart' })
  @ApiBearerAuth()
  async addToCart(
    @Param('id') id: string,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<{
    message: string;
    user: User;
    cartCount: number;
  }> {
    const user = await this.userService.addToCart(id, addToCartDto.courseId);
    return {
      message: 'Course added to cart successfully',
      user,
      cartCount: user.cart.length,
    };
  }

  @Delete(':id/cart/remove')
  @ApiOperation({ summary: 'Remove course from user cart' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Course removed from cart successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Course not in cart' })
  @ApiBearerAuth()
  async removeFromCart(
    @Param('id') id: string,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ): Promise<{
    message: string;
    user: User;
    cartCount: number;
  }> {
    const user = await this.userService.removeFromCart(
      id,
      removeFromCartDto.courseId,
    );
    return {
      message: 'Course removed from cart successfully',
      user,
      cartCount: user.cart.length,
    };
  }

  @Get(':id/cart')
  @ApiOperation({ summary: 'Get user cart with course details' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User cart retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async getUserCart(@Param('id') id: string): Promise<{
    cart: any[];
    cartCount: number;
    totalAmount?: number;
  }> {
    return await this.userService.getUserCart(id);
  }

  @Delete(':id/cart/clear')
  @ApiOperation({ summary: 'Clear user cart' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async clearCart(@Param('id') id: string): Promise<{
    message: string;
    user: User;
  }> {
    const user = await this.userService.clearCart(id);
    return {
      message: 'Cart cleared successfully',
      user,
    };
  }

  @Patch(':id/cart/update')
  @ApiOperation({ summary: 'Update entire cart with course IDs' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async updateCart(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<{
    message: string;
    user: User;
    cartCount: number;
  }> {
    const user = await this.userService.updateCart(id, updateCartDto.courseIds);
    return {
      message: 'Cart updated successfully',
      user,
      cartCount: user.cart.length,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name or email',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'blocked'],
  })
  @ApiQuery({ name: 'important', required: false, type: Boolean })
  @ApiQuery({
    name: 'interest',
    required: false,
    description: 'Filter by interest',
  })
  @ApiQuery({
    name: 'stream',
    required: false,
    description: 'Filter by stream',
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiBearerAuth()
  async findAll(@Query() queryDto: UserQueryDto): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return await this.userService.findAll(queryDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  @ApiBearerAuth()
  async getStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    importantUsers: number;
    todayEnquiries: number;
    totalCartItems: number;
    usersWithCartItems: number;
  }> {
    return await this.userService.getUserStats();
  }

  @Get('important')
  @ApiOperation({ summary: 'Get all important users (repeat enquiries)' })
  @ApiResponse({
    status: 200,
    description: 'Important users retrieved successfully',
    type: [User],
  })
  @ApiBearerAuth()
  async getImportantUsers(): Promise<User[]> {
    return await this.userService.getImportantUsers();
  }

  @Get('phone/:phone')
  @ApiOperation({ summary: 'Find user by phone number' })
  @ApiParam({ name: 'phone', description: 'User phone number' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async findByPhone(@Param('phone') phone: string): Promise<User | null> {
    return await this.userService.findByPhone(phone);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find user by email' })
  @ApiParam({ name: 'email', description: 'User email' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.userService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.userService.remove(id);
  }

  @Post(':id/purchased-courses/add')
@ApiOperation({ summary: 'Add course to user purchased courses' })
@ApiParam({ name: 'id', description: 'User ID' })
@ApiResponse({
  status: 200,
  description: 'Course added to purchased courses successfully',
  type: User,
})
@ApiResponse({ status: 404, description: 'User not found' })
@ApiResponse({ status: 400, description: 'Course already purchased' })
@ApiBearerAuth()
async addToPurchasedCourses(
  @Param('id') id: string,
  @Body() addToCartDto: AddToCartDto, // Reusing existing DTO
): Promise<{
  message: string;
  user: User;
  totalPurchasedCourses: number;
}> {
  const user = await this.userService.addToPurchasedCourses(id, addToCartDto.courseId);
  return {
    message: 'Course added to purchased courses successfully',
    user,
    totalPurchasedCourses: user.purchasedCourses.length,
  };
}

@Delete(':id/purchased-courses/remove')
@ApiOperation({ summary: 'Remove course from user purchased courses' })
@ApiParam({ name: 'id', description: 'User ID' })
@ApiResponse({
  status: 200,
  description: 'Course removed from purchased courses successfully',
  type: User,
})
@ApiResponse({ status: 404, description: 'User not found' })
@ApiResponse({ status: 400, description: 'Course not found in purchased courses' })
@ApiBearerAuth()
async removeFromPurchasedCourses(
  @Param('id') id: string,
  @Body() removeFromCartDto: RemoveFromCartDto, // Reusing existing DTO
): Promise<{
  message: string;
  user: User;
  totalPurchasedCourses: number;
}> {
  const user = await this.userService.removeFromPurchasedCourses(id, removeFromCartDto.courseId);
  return {
    message: 'Course removed from purchased courses successfully',
    user,
    totalPurchasedCourses: user.purchasedCourses.length,
  };
}
}
