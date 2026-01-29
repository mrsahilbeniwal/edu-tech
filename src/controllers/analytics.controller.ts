import { Controller, Get, Query, HttpStatus, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';
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

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get comprehensive dashboard analytics',
    description: 'Returns all analytics data needed for the main dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard analytics retrieved successfully',
  })
  @ApiBearerAuth()
  async getDashboardAnalytics(
    @Query() queryDto: AnalyticsQueryDto,
  ): Promise<DashboardAnalytics> {
    return await this.analyticsService.getDashboardAnalytics(queryDto);
  }

  @Get('monthly-stats')
  @ApiOperation({
    summary: 'Get monthly user statistics',
    description:
      'Returns month-wise breakdown of user registrations and enquiries',
  })
  @ApiQuery({ name: 'year', required: false, description: 'Year filter' })
  @ApiQuery({
    name: 'months',
    required: false,
    description: 'Number of months back',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly statistics retrieved successfully',
  })
  @ApiBearerAuth()
  async getMonthlyStats(
    @Query() queryDto: AnalyticsQueryDto,
  ): Promise<MonthlyStats[]> {
    return await this.analyticsService.getMonthlyStats(queryDto);
  }

  @Get('user-growth')
  @ApiOperation({
    summary: 'Get user growth analytics',
    description: 'Returns user growth data with growth rates over time',
  })
  @ApiResponse({
    status: 200,
    description: 'User growth data retrieved successfully',
  })
  @ApiBearerAuth()
  async getUserGrowth(
    @Query() queryDto: AnalyticsQueryDto,
  ): Promise<UserGrowthData[]> {
    return await this.analyticsService.getUserGrowthAnalytics(queryDto);
  }

  @Get('enquiry-analytics')
  @ApiOperation({
    summary: 'Get enquiry form analytics',
    description: 'Returns detailed analytics about enquiry form submissions',
  })
  @ApiResponse({
    status: 200,
    description: 'Enquiry analytics retrieved successfully',
  })
  @ApiBearerAuth()
  async getEnquiryAnalytics(
    @Query() queryDto: AnalyticsQueryDto,
  ): Promise<EnquiryAnalytics[]> {
    return await this.analyticsService.getEnquiryAnalytics(queryDto);
  }

  @Get('interest-breakdown')
  @ApiOperation({
    summary: 'Get interest-wise user breakdown',
    description: 'Returns distribution of users by their interests',
  })
  @ApiResponse({
    status: 200,
    description: 'Interest breakdown retrieved successfully',
  })
  @ApiBearerAuth()
  async getInterestBreakdown(
    @Query() queryDto: AnalyticsQueryDto,
  ): Promise<InterestAnalytics[]> {
    return await this.analyticsService.getInterestBreakdown(queryDto);
  }

  @Get('stream-breakdown')
  @ApiOperation({
    summary: 'Get stream-wise user breakdown',
    description: 'Returns distribution of users by their educational streams',
  })
  @ApiResponse({
    status: 200,
    description: 'Stream breakdown retrieved successfully',
  })
  @ApiBearerAuth()
  async getStreamBreakdown(
    @Query() queryDto: AnalyticsQueryDto,
  ): Promise<StreamAnalytics[]> {
    return await this.analyticsService.getStreamBreakdown(queryDto);
  }

  @Get('date-range')
  @ApiOperation({
    summary: 'Get analytics for specific date range',
    description: 'Returns analytics data for a custom date range',
  })
  @ApiResponse({
    status: 200,
    description: 'Date range analytics retrieved successfully',
  })
  @ApiBearerAuth()
  async getDateRangeAnalytics(@Query() dateRangeDto: DateRangeDto): Promise<{
    totalUsers: number;
    newUsers: number;
    totalEnquiries: number;
    importantUsers: number;
    averageEnquiriesPerUser: number;
    topInterests: InterestAnalytics[];
    topStreams: StreamAnalytics[];
  }> {
    return await this.analyticsService.getDateRangeAnalytics(dateRangeDto);
  }

  @Get('recent-activity')
  @ApiOperation({
    summary: 'Get recent user activity',
    description: 'Returns recent user registrations and enquiries',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activity retrieved successfully',
  })
  @ApiBearerAuth()
  async getRecentActivity(@Query('limit') limit: number = 10): Promise<{
    recentUsers: any[];
    recentEnquiries: any[];
  }> {
    return await this.analyticsService.getRecentActivity(limit);
  }

  @Get('conversion-metrics')
  @ApiOperation({
    summary: 'Get conversion metrics',
    description: 'Returns metrics about enquiry to conversion rates',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversion metrics retrieved successfully',
  })
  @ApiBearerAuth()
  async getConversionMetrics(@Query() queryDto: AnalyticsQueryDto): Promise<{
    totalEnquiries: number;
    uniqueUsers: number;
    repeatEnquiries: number;
    conversionRate: number;
    averageEnquiriesPerUser: number;
    importantUserPercentage: number;
  }> {
    return await this.analyticsService.getConversionMetrics(queryDto);
  }
}
