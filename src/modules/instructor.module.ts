import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstructorService } from '../services/instructor.service';
import { InstructorController } from '../controllers/instructor.controller';
import { Instructor, InstructorSchema } from '../schemas/instructor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instructor.name, schema: InstructorSchema },
    ]),
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService], // Export service if needed in other modules
})
export class InstructorModule {}
