import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import {
  CreateUserDto,
  UpdateUserDto,
  EnquiryFormDto,
  UserQueryDto,
} from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if user with same phone OR email already exists
      const existingUser = await this.userModel.findOne({
        $or: [{ phone: createUserDto.phone }, { email: createUserDto.email }],
      });

      if (existingUser) {
        // Just return existing user instead of throwing
        return existingUser;
      }

      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      throw new BadRequestException('Failed to create or fetch user');
    }
  }

  async submitEnquiryForm(enquiryFormDto: EnquiryFormDto): Promise<User> {
    try {
      // Check if user with same phone already exists
      const existingUser = await this.userModel.findOne({
        phone: enquiryFormDto.phone,
      });

      if (existingUser) {
        // User exists - mark as important and increment enquiry count
        existingUser.important = true;
        existingUser.enquiryCount += 1;
        existingUser.lastEnquiryDate = new Date();

        // Update other fields with new data
        existingUser.name = enquiryFormDto.name;
        existingUser.email = enquiryFormDto.email;
        existingUser.interest = enquiryFormDto.interest;
        existingUser.stream = enquiryFormDto.stream;
        if (enquiryFormDto.message) {
          existingUser.message = enquiryFormDto.message;
        }

        return await existingUser.save();
      } else {
        // Create new user from enquiry form
        const newUser = new this.userModel({
          ...enquiryFormDto,
          enquiryCount: 1,
          lastEnquiryDate: new Date(),
        });

        return await newUser.save();
      }
    } catch (error) {
      throw new BadRequestException(
        'Failed to submit enquiry form - ' + error.message,
      );
    }
  }

  // Cart Management Methods
  async addToCart(userId: string, courseId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const courseObjectId = new Types.ObjectId(courseId);

    // Check if course is already in cart
    if (user.cart.some((id) => id.equals(courseObjectId))) {
      throw new BadRequestException('Course already in cart');
    }

    // Check if course is already purchased
    if (user.purchasedCourses.some((id) => id.equals(courseObjectId))) {
      throw new BadRequestException('Course already purchased');
    }

    user.cart.push(courseObjectId);
    return await user.save();
  }

  async removeFromCart(userId: string, courseId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const courseObjectId = new Types.ObjectId(courseId);
    const courseIndex = user.cart.findIndex((id) => id.equals(courseObjectId));

    if (courseIndex === -1) {
      throw new BadRequestException('Course not found in cart');
    }

    user.cart.splice(courseIndex, 1);
    return await user.save();
  }

  async getUserCart(userId: string): Promise<{
    cart: any[];
    cartCount: number;
    totalAmount?: number;
  }> {
    const user = await this.userModel.findById(userId).populate({
      path: 'cart',
      select: 'title description price image duration level instructor',
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate total amount if courses have price field
    const totalAmount = user.cart.reduce((total: number, course: any) => {
      return total + (course.price || 0);
    }, 0);

    return {
      cart: user.cart,
      cartCount: user.cart.length,
      totalAmount,
    };
  }

  async clearCart(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.cart = [];
    return await user.save();
  }

  async updateCart(userId: string, courseIds: string[]): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Convert string IDs to ObjectIds and remove duplicates
    const courseObjectIds = [...new Set(courseIds)].map(
      (id) => new Types.ObjectId(id),
    );

    // Filter out already purchased courses
    const validCourseIds = courseObjectIds.filter(
      (courseId) =>
        !user.purchasedCourses.some((purchasedId) =>
          purchasedId.equals(courseId),
        ),
    );

    user.cart = validCourseIds;
    return await user.save();
  }

  // Method to move cart items to purchased courses (for checkout process)
  async purchaseCartItems(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.cart.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Move cart items to purchased courses
    user.purchasedCourses.push(...user.cart);
    user.cart = [];

    return await user.save();
  }

  // Get user's purchased courses
  async getUserPurchasedCourses(userId: string): Promise<{
    courses: any[];
    totalCourses: number;
  }> {
    const user = await this.userModel.findById(userId).populate({
      path: 'purchasedCourses',
      select: 'title description image duration level instructor',
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      courses: user.purchasedCourses,
      totalCourses: user.purchasedCourses.length,
    };
  }

  async findAll(queryDto: UserQueryDto): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      important,
      interest,
      stream,
    } = queryDto;

    // Build filter object
    const filter: FilterQuery<UserDocument> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (important !== undefined) {
      filter.important = important;
    }

    if (interest) {
      filter.interest = { $regex: interest, $options: 'i' };
    }

    if (stream) {
      filter.stream = { $regex: stream, $options: 'i' };
    }

    const total = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const users = await this.userModel
      .find(filter)
      .populate('cart', 'title price')
      .populate('purchasedCourses', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      users,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('cart', 'title description price image')
      .populate('purchasedCourses', 'title description image');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userModel
      .findOne({ phone })
      .populate('cart', 'title price')
      .populate('purchasedCourses', 'title');
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel
      .findOne({ email })
      .populate('cart', 'title price')
      .populate('purchasedCourses', 'title');
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async getImportantUsers(): Promise<User[]> {
    return await this.userModel
      .find({ important: true })
      .populate('cart', 'title price')
      .sort({ lastEnquiryDate: -1 })
      .exec();
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    importantUsers: number;
    todayEnquiries: number;
    totalCartItems: number;
    usersWithCartItems: number;
  }> {
    const totalUsers = await this.userModel.countDocuments();
    const activeUsers = await this.userModel.countDocuments({
      status: 'active',
    });
    const importantUsers = await this.userModel.countDocuments({
      important: true,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEnquiries = await this.userModel.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Cart statistics
    const cartStats = await this.userModel.aggregate([
      {
        $project: {
          cartCount: { $size: '$cart' },
          hasCartItems: { $gt: [{ $size: '$cart' }, 0] },
        },
      },
      {
        $group: {
          _id: null,
          totalCartItems: { $sum: '$cartCount' },
          usersWithCartItems: { $sum: { $cond: ['$hasCartItems', 1, 0] } },
        },
      },
    ]);

    const cartStatsResult = cartStats[0] || {
      totalCartItems: 0,
      usersWithCartItems: 0,
    };

    return {
      totalUsers,
      activeUsers,
      importantUsers,
      todayEnquiries,
      totalCartItems: cartStatsResult.totalCartItems,
      usersWithCartItems: cartStatsResult.usersWithCartItems,
    };
  }
  async addToPurchasedCourses(userId: string, courseId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const courseObjectId = new Types.ObjectId(courseId);

    // Check if course is already purchased
    if (user.purchasedCourses.some((id) => id.equals(courseObjectId))) {
      throw new BadRequestException('Course already purchased');
    }

    user.purchasedCourses.push(courseObjectId);

    // Optional: Remove from cart if it exists there
    const cartIndex = user.cart.findIndex((id) => id.equals(courseObjectId));
    if (cartIndex !== -1) {
      user.cart.splice(cartIndex, 1);
    }

    return await user.save();
  }

  async removeFromPurchasedCourses(
    userId: string,
    courseId: string,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const courseObjectId = new Types.ObjectId(courseId);
    const courseIndex = user.purchasedCourses.findIndex((id) =>
      id.equals(courseObjectId),
    );

    if (courseIndex === -1) {
      throw new BadRequestException('Course not found in purchased courses');
    }

    user.purchasedCourses.splice(courseIndex, 1);
    return await user.save();
  }
}
