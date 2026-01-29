import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import {
  AnalyticsQueryDto,
  DateRangeDto,
  DashboardAnalytics,
  MonthlyStats,
  UserGrowthData,
  EnquiryAnalytics,
  InterestAnalytics,
  StreamAnalytics,
} from '../dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getDashboardAnalytics(
    queryDto: AnalyticsQueryDto,
  ): Promise<DashboardAnalytics> {
    const { months = 12 } = queryDto;

    // Get overview stats
    const overview = await this.getOverviewStats();

    // Get monthly stats
    const monthlyStats = await this.getMonthlyStats({ ...queryDto, months });

    // Get user growth data
    const userGrowth = await this.getUserGrowthAnalytics({
      ...queryDto,
      months,
    });

    // Get enquiry analytics
    const enquiryAnalytics = await this.getEnquiryAnalytics({
      ...queryDto,
      months,
    });

    // Get interest and stream breakdowns
    const interestBreakdown = await this.getInterestBreakdown(queryDto);
    const streamBreakdown = await this.getStreamBreakdown(queryDto);

    // Get recent activity
    const recentActivity = await this.getRecentActivity(5);

    return {
      overview,
      monthlyStats,
      userGrowth,
      enquiryAnalytics,
      interestBreakdown,
      streamBreakdown,
      recentActivity,
    };
  }

  private async getOverviewStats(): Promise<DashboardAnalytics['overview']> {
    const totalUsers = await this.userModel.countDocuments();
    const importantUsers = await this.userModel.countDocuments({
      important: true,
    });
    const activeUsers = await this.userModel.countDocuments({
      status: 'active',
    });

    // Calculate total enquiries (sum of all enquiryCount)
    const enquiryResult = await this.userModel.aggregate([
      { $group: { _id: null, totalEnquiries: { $sum: '$enquiryCount' } } },
    ]);
    const totalEnquiries = enquiryResult[0]?.totalEnquiries || 0;

    // Today's new users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayUsers = await this.userModel.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // This month's new users
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthUsers = await this.userModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Calculate growth rate (this month vs last month)
    const lastMonthStart = new Date(startOfMonth);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonthEnd = new Date(startOfMonth);

    const lastMonthUsers = await this.userModel.countDocuments({
      createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
    });

    const growthRate =
      lastMonthUsers > 0
        ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
        : 0;

    return {
      totalUsers,
      totalEnquiries,
      importantUsers,
      activeUsers,
      todayUsers,
      thisMonthUsers,
      growthRate: Math.round(growthRate * 100) / 100,
    };
  }

  async getMonthlyStats(queryDto: AnalyticsQueryDto): Promise<MonthlyStats[]> {
    const { months = 12, status, interest, stream } = queryDto;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Build match conditions
    const matchConditions: any = {
      createdAt: { $gte: startDate },
    };

    if (status) matchConditions.status = status;
    if (interest)
      matchConditions.interest = { $regex: interest, $options: 'i' };
    if (stream) matchConditions.stream = { $regex: stream, $options: 'i' };

    const pipeline = [
      { $match: matchConditions },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          newUsers: { $sum: 1 },
          totalEnquiries: { $sum: '$enquiryCount' },
          uniqueEnquiries: {
            $sum: { $cond: [{ $eq: ['$enquiryCount', 1] }, 1, 0] },
          },
          repeatEnquiries: {
            $sum: {
              $cond: [{ $gt: ['$enquiryCount', 1] }, '$enquiryCount', 0],
            },
          },
          importantUsers: { $sum: { $cond: ['$important', 1, 0] } },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          inactiveUsers: {
            $sum: { $cond: [{ $ne: ['$status', 'active'] }, 1, 0] },
          },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 } as const,
      },
    ];

    const results = await this.userModel.aggregate(pipeline);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return results.map((result) => ({
      month: `${result._id.year}-${result._id.month.toString().padStart(2, '0')}`,
      year: result._id.year,
      monthName: monthNames[result._id.month - 1],
      newUsers: result.newUsers,
      totalEnquiries: result.totalEnquiries,
      uniqueEnquiries: result.uniqueEnquiries,
      repeatEnquiries: result.repeatEnquiries,
      importantUsers: result.importantUsers,
      activeUsers: result.activeUsers,
      inactiveUsers: result.inactiveUsers,
    }));
  }

  async getUserGrowthAnalytics(
    queryDto: AnalyticsQueryDto,
  ): Promise<UserGrowthData[]> {
    const monthlyStats = await this.getMonthlyStats(queryDto);
    let cumulativeUsers = 0;

    return monthlyStats.map((stat, index) => {
      cumulativeUsers += stat.newUsers;
      const previousCumulative =
        index > 0 ? cumulativeUsers - stat.newUsers : 0;
      const growthRate =
        previousCumulative > 0 ? (stat.newUsers / previousCumulative) * 100 : 0;

      return {
        period: `${stat.monthName} ${stat.year}`,
        newUsers: stat.newUsers,
        totalUsers: cumulativeUsers,
        growthRate: Math.round(growthRate * 100) / 100,
      };
    });
  }

  async getEnquiryAnalytics(
    queryDto: AnalyticsQueryDto,
  ): Promise<EnquiryAnalytics[]> {
    const monthlyStats = await this.getMonthlyStats(queryDto);

    return monthlyStats.map((stat) => {
      const conversionRate =
        stat.newUsers > 0 ? (stat.totalEnquiries / stat.newUsers) * 100 : 0;

      return {
        period: `${stat.monthName} ${stat.year}`,
        totalEnquiries: stat.totalEnquiries,
        newEnquiries: stat.uniqueEnquiries,
        repeatEnquiries: stat.repeatEnquiries,
        conversionRate: Math.round(conversionRate * 100) / 100,
      };
    });
  }

  async getInterestBreakdown(
    queryDto: AnalyticsQueryDto,
  ): Promise<InterestAnalytics[]> {
    const { status, stream } = queryDto;

    const matchConditions: any = {};
    if (status) matchConditions.status = status;
    if (stream) matchConditions.stream = { $regex: stream, $options: 'i' };

    const pipeline = [
      { $match: matchConditions },
      {
        $group: {
          _id: '$interest',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } as const },
    ];

    const results = await this.userModel.aggregate(pipeline);
    const totalUsers = results.reduce((sum, item) => sum + item.count, 0);

    return results.map((result) => ({
      interest: result._id || 'Not Specified',
      count: result.count,
      percentage: Math.round((result.count / totalUsers) * 10000) / 100,
    }));
  }

  async getStreamBreakdown(
    queryDto: AnalyticsQueryDto,
  ): Promise<StreamAnalytics[]> {
    const { status, interest } = queryDto;

    const matchConditions: any = {};
    if (status) matchConditions.status = status;
    if (interest)
      matchConditions.interest = { $regex: interest, $options: 'i' };

    const pipeline = [
      { $match: matchConditions },
      {
        $group: {
          _id: '$stream',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } as const },
    ];

    const results = await this.userModel.aggregate(pipeline);
    const totalUsers = results.reduce((sum, item) => sum + item.count, 0);

    return results.map((result) => ({
      stream: result._id || 'Not Specified',
      count: result.count,
      percentage: Math.round((result.count / totalUsers) * 10000) / 100,
    }));
  }

  async getDateRangeAnalytics(dateRangeDto: DateRangeDto): Promise<{
    totalUsers: number;
    newUsers: number;
    totalEnquiries: number;
    importantUsers: number;
    averageEnquiriesPerUser: number;
    topInterests: InterestAnalytics[];
    topStreams: StreamAnalytics[];
  }> {
    const matchConditions: any = {};

    if (dateRangeDto.startDate || dateRangeDto.endDate) {
      matchConditions.createdAt = {};
      if (dateRangeDto.startDate) {
        matchConditions.createdAt.$gte = new Date(dateRangeDto.startDate);
      }
      if (dateRangeDto.endDate) {
        const endDate = new Date(dateRangeDto.endDate);
        endDate.setHours(23, 59, 59, 999);
        matchConditions.createdAt.$lte = endDate;
      }
    }

    const users = await this.userModel.find(matchConditions);
    const totalUsers = users.length;
    const totalEnquiries = users.reduce(
      (sum, user) => sum + (user.enquiryCount || 1),
      0,
    );
    const importantUsers = users.filter((user) => user.important).length;
    const averageEnquiriesPerUser =
      totalUsers > 0 ? totalEnquiries / totalUsers : 0;

    // Get top interests and streams for the date range
    const topInterests = await this.getInterestBreakdown({});
    const topStreams = await this.getStreamBreakdown({});

    return {
      totalUsers,
      newUsers: totalUsers, // All users in the date range are "new" to that range
      totalEnquiries,
      importantUsers,
      averageEnquiriesPerUser: Math.round(averageEnquiriesPerUser * 100) / 100,
      topInterests: topInterests.slice(0, 5),
      topStreams: topStreams.slice(0, 5),
    };
  }

  async getRecentActivity(limit: number): Promise<{
    recentUsers: any[];
    recentEnquiries: any[];
  }> {
    const recentUsers = await this.userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email phone interest stream createdAt status important')
      .lean();

    const recentEnquiries = await this.userModel
      .find({ lastEnquiryDate: { $exists: true } })
      .sort({ lastEnquiryDate: -1 })
      .limit(limit)
      .select(
        'name email phone interest stream lastEnquiryDate enquiryCount important',
      )
      .lean();

    return {
      recentUsers,
      recentEnquiries,
    };
  }

  async getConversionMetrics(queryDto: AnalyticsQueryDto): Promise<{
    totalEnquiries: number;
    uniqueUsers: number;
    repeatEnquiries: number;
    conversionRate: number;
    averageEnquiriesPerUser: number;
    importantUserPercentage: number;
  }> {
    const { status, interest, stream } = queryDto;

    const matchConditions: any = {};
    if (status) matchConditions.status = status;
    if (interest)
      matchConditions.interest = { $regex: interest, $options: 'i' };
    if (stream) matchConditions.stream = { $regex: stream, $options: 'i' };

    const pipeline = [
      { $match: matchConditions },
      {
        $group: {
          _id: null,
          totalEnquiries: { $sum: '$enquiryCount' },
          uniqueUsers: { $sum: 1 },
          repeatEnquiries: {
            $sum: {
              $cond: [
                { $gt: ['$enquiryCount', 1] },
                { $subtract: ['$enquiryCount', 1] },
                0,
              ],
            },
          },
          importantUsers: { $sum: { $cond: ['$important', 1, 0] } },
        },
      },
    ];

    const result = await this.userModel.aggregate(pipeline);
    const stats = result[0] || {
      totalEnquiries: 0,
      uniqueUsers: 0,
      repeatEnquiries: 0,
      importantUsers: 0,
    };

    const conversionRate =
      stats.uniqueUsers > 0
        ? (stats.importantUsers / stats.uniqueUsers) * 100
        : 0;

    const averageEnquiriesPerUser =
      stats.uniqueUsers > 0 ? stats.totalEnquiries / stats.uniqueUsers : 0;

    const importantUserPercentage =
      stats.uniqueUsers > 0
        ? (stats.importantUsers / stats.uniqueUsers) * 100
        : 0;

    return {
      totalEnquiries: stats.totalEnquiries,
      uniqueUsers: stats.uniqueUsers,
      repeatEnquiries: stats.repeatEnquiries,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageEnquiriesPerUser: Math.round(averageEnquiriesPerUser * 100) / 100,
      importantUserPercentage: Math.round(importantUserPercentage * 100) / 100,
    };
  }
}
