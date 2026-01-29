import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AnalyticsQueryDto {
  @ApiProperty({
    description: 'Year for analytics',
    example: 2024,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(2020)
  @Max(2030)
  year?: number;

  @ApiProperty({
    description: 'Number of months to go back',
    example: 12,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(24)
  months?: number;

  @ApiProperty({
    description: 'Filter by user status',
    enum: ['active', 'inactive', 'blocked'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'blocked'])
  status?: string;

  @ApiProperty({ description: 'Filter by interest', required: false })
  @IsOptional()
  @IsString()
  interest?: string;

  @ApiProperty({ description: 'Filter by stream', required: false })
  @IsOptional()
  @IsString()
  stream?: string;
}

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    description: 'End date (YYYY-MM-DD)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsString()
  endDate?: string;
}

export interface MonthlyStats {
  month: string;
  year: number;
  monthName: string;
  newUsers: number;
  totalEnquiries: number;
  uniqueEnquiries: number;
  repeatEnquiries: number;
  importantUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface UserGrowthData {
  period: string;
  newUsers: number;
  totalUsers: number;
  growthRate: number;
}

export interface EnquiryAnalytics {
  period: string;
  totalEnquiries: number;
  newEnquiries: number;
  repeatEnquiries: number;
  conversionRate: number;
}

export interface InterestAnalytics {
  interest: string;
  count: number;
  percentage: number;
}

export interface StreamAnalytics {
  stream: string;
  count: number;
  percentage: number;
}

export interface DashboardAnalytics {
  overview: {
    totalUsers: number;
    totalEnquiries: number;
    importantUsers: number;
    activeUsers: number;
    todayUsers: number;
    thisMonthUsers: number;
    growthRate: number;
  };
  monthlyStats: MonthlyStats[];
  userGrowth: UserGrowthData[];
  enquiryAnalytics: EnquiryAnalytics[];
  interestBreakdown: InterestAnalytics[];
  streamBreakdown: StreamAnalytics[];
  recentActivity: {
    recentUsers: any[];
    recentEnquiries: any[];
  };
}
