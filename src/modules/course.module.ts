import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from '../controllers/course.controller';
import { CategoryController } from '../controllers/category.controller';
import { CourseService } from '../services/course.service';
import { CategoryService } from '../services/category.service';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Category, CategorySchema } from '../schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CourseController, CategoryController],
  providers: [CourseService, CategoryService],
  exports: [CourseService, CategoryService],
})
export class CourseModule {}
