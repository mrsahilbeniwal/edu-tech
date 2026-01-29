import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class InstructorDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com/instructor.jpg' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'Senior Web Developer with 10+ years experience' })
  @IsString()
  @IsNotEmpty()
  bio: string;
}

class CurriculumDto {
  @ApiProperty({ example: 'HTML Fundamentals' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2 hours' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  lessons: number;
}

class SyllabusTopicDto {
  @ApiProperty({ example: 'SQL Mastery' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Complex SQL queries, performance tuning, and optimization',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['Complex joins', 'Window functions', 'Performance tuning'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subtopics?: string[];

  @ApiProperty({ example: '4-6 weeks' })
  @IsString()
  @IsNotEmpty()
  duration: string;
}

class PhaseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  phaseNumber: number;

  @ApiProperty({ example: 'Foundation Phase' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '4-6 weeks' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ example: ['SQL', 'Python/DSA', 'Data Modeling'] })
  @IsArray()
  @IsString({ each: true })
  focusAreas: string[];

  @ApiProperty({
    example: ['Complex queries', 'Data structures', 'Schema design'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ example: ['MySQL', 'PostgreSQL', 'Python'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tools?: string[];
}

class ProjectDto {
  @ApiProperty({ example: 'Real-Time Analytics Pipeline' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Build a pipeline that processes real-time user interaction data',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Intermediate' })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ example: ['Kafka', 'Spark', 'Cassandra', 'Grafana'] })
  @IsArray()
  @IsString({ each: true })
  techStack: string[];

  @ApiProperty({ example: '2-3 weeks' })
  @IsString()
  @IsNotEmpty()
  estimatedDuration: string;

  @ApiProperty({ example: ['Streaming', 'Fault tolerance', 'Monitoring'] })
  @IsArray()
  @IsString({ each: true })
  skillsDemonstrated: string[];

  @ApiProperty({
    example: ['Working pipeline', 'Architecture diagram', 'Documentation'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deliverables?: string[];

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isBonus?: boolean;

  @ApiProperty({ example: 'Netflix, Meta' })
  @IsString()
  @IsOptional()
  inspiredBy?: string;
}

class MarketTrendDto {
  @ApiProperty({ example: 'Cloud-Native Data Platforms' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Increasing reliance on AWS, GCP, and Azure-native tools',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'High' })
  @IsString()
  @IsNotEmpty()
  impact: string;

  @ApiProperty({ example: ['AWS Redshift', 'BigQuery', 'Synapse'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relatedTools?: string[];
}

class SalaryInfoDto {
  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  @Min(0)
  minSalary: number;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @Min(0)
  maxSalary: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsOptional()
  baseCurrency?: string;
}

class FAQDto {
  @ApiProperty({
    example: 'What prerequisites do I need for this course?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    example:
      'You need basic JavaScript knowledge and familiarity with HTML/CSS.',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Complete Web Development Bootcamp' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://example.com/course-image.jpg' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'https://example.com/course-brochure.pdf' })
  @IsString()
  @IsOptional()
  brochure?: string;

  @ApiProperty({ example: 'https://example.com/course-image.jpg' })
  @IsString()
  @IsOptional()
  video?: string;

  @ApiProperty({ example: 299.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 199.99, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({ example: 4.5, required: false })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 120, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalRatings?: number;

  @ApiProperty({ example: '40 hours' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ type: [InstructorDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => InstructorDto)
  instructor: InstructorDto[];

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: 'Beginner',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ example: 1250, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  enrolledStudents?: number;

  @ApiProperty({ example: ['JavaScript', 'React', 'Node.js'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 'complete-web-development-bootcamp' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ type: [CurriculumDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CurriculumDto)
  @IsOptional()
  curriculum?: CurriculumDto[];

  @ApiProperty({
    example: ['Basic computer knowledge', 'Internet connection'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiProperty({
    example: ['Build responsive websites', 'Create web applications'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  learningOutcomes?: string[];

  // New fields for enhanced functionality
  @ApiProperty({ type: [SyllabusTopicDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyllabusTopicDto)
  @IsOptional()
  syllabus?: SyllabusTopicDto[];

  @ApiProperty({ type: [PhaseDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhaseDto)
  @IsOptional()
  phases?: PhaseDto[];

  @ApiProperty({ type: [ProjectDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  @IsOptional()
  projects?: ProjectDto[];

  @ApiProperty({ type: [MarketTrendDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketTrendDto)
  @IsOptional()
  marketTrends?: MarketTrendDto[];

  @ApiProperty({ type: [SalaryInfoDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryInfoDto)
  @IsOptional()
  salaryInfo?: SalaryInfoDto[];

  @ApiProperty({ example: 3, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  totalPhases?: number;

  @ApiProperty({ example: 6, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  totalProjects?: number;

  @ApiProperty({ example: ['FAANG', 'MANG', 'Startups'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetCompanies?: string[];

  @ApiProperty({
    example:
      'Data engineering roles are experiencing exponential demand growth...',
    required: false,
  })
  @IsString()
  @IsOptional()
  marketOverview?: string;

  @ApiProperty({
    example: 'Strong career growth with high compensation packages...',
    required: false,
  })
  @IsString()
  @IsOptional()
  careerOutlook?: string;

  @ApiProperty({
    type: [FAQDto],
    required: false,
    description: 'Frequently asked questions for the course',
    example: [
      {
        question: 'What prerequisites do I need?',
        answer: 'Basic JavaScript knowledge',
      },
      {
        question: 'Can I download course materials?',
        answer: 'Yes, all materials are downloadable',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FAQDto)
  @IsOptional()
  faq?: FAQDto[];
}
