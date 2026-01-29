import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define instructor schema
@Schema({ _id: false })
export class Instructor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  bio: string;
}

// Define curriculum schema
@Schema({ _id: false })
export class Curriculum {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  lessons: number;
}

// Define syllabus topic schema
@Schema({ _id: false })
export class SyllabusTopic {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  subtopics: string[];

  @Prop({ required: true })
  duration: string; // e.g., "2 weeks", "10 hours"
}

// Define phase schema for structured learning
@Schema({ _id: false })
export class Phase {
  @Prop({ required: true })
  phaseNumber: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ type: [String], required: true })
  focusAreas: string[];

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  tools: string[];
}

// Define project schema
@Schema({ _id: false })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  difficulty: string; // Beginner, Intermediate, Advanced

  @Prop({ type: [String], required: true })
  techStack: string[];

  @Prop({ required: true })
  estimatedDuration: string;

  @Prop({ required: true })
  skillsDemonstrated: string[];

  @Prop({ type: [String], default: [] })
  deliverables: string[];

  @Prop({ default: false })
  isBonus: boolean;

  @Prop()
  inspiredBy?: string; // e.g., "Netflix, Meta"
}

// Define market trends schema
@Schema({ _id: false })
export class MarketTrend {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  impact: string; // High, Medium, Low

  @Prop({ type: [String], default: [] })
  relatedTools: string[];
}

// Define salary info schema
@Schema({ _id: false })
export class SalaryInfo {
  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  minSalary: number;

  @Prop({ required: true })
  maxSalary: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 'USD' })
  baseCurrency: string;
}

@Schema({ _id: false })
export class FAQ {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({
    trim: true,
    default: 'https://youtu.be/WQoB2z67hvY?si=Jjhsc3eq-yWy-7M8',
  })
  video?: string;

  @Prop({
    trim: true,
    default:
      'https://file-examples.com/wp-content/storage/2017/10/file-sample_150kB.pdf',
  })
  brochure?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discountPrice: number;

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0 })
  totalRatings: number;

  @Prop({ required: true })
  duration: string; // e.g., "10 hours", "2 weeks"

  @Prop({ type: [Instructor], required: true })
  instructor: Instructor[];

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true })
  level: string; // Beginner, Intermediate, Advanced

  @Prop({ default: 0 })
  enrolledStudents: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: [Curriculum], default: [] })
  curriculum: Curriculum[];

  @Prop({ type: [String], default: [] })
  requirements: string[];

  @Prop({ type: [String], default: [] })
  learningOutcomes: string[];

  // New fields for enhanced functionality
  @Prop({ type: [SyllabusTopic], default: [] })
  syllabus: SyllabusTopic[];

  @Prop({ type: [Phase], default: [] })
  phases: Phase[];

  @Prop({ type: [Project], default: [] })
  projects: Project[];

  @Prop({ type: [MarketTrend], default: [] })
  marketTrends: MarketTrend[];

  @Prop({ type: [SalaryInfo], default: [] })
  salaryInfo: SalaryInfo[];

  @Prop()
  totalPhases?: number;

  @Prop()
  totalProjects?: number;

  @Prop({ type: [String], default: [] })
  targetCompanies: string[]; // e.g., ["FAANG", "MANG", "Startups"]

  @Prop()
  marketOverview?: string;

  @Prop()
  careerOutlook?: string;

  @Prop({ type: [FAQ], default: [] })
  faq: FAQ[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
