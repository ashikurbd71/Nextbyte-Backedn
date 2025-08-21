import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { Module as CourseModule } from './entities/module.entity';
import { Course } from '../course/entities/course.entity';
import { NotificationModule } from '../notification/notification.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseModule, Course]),
    NotificationModule,
    EnrollmentModule
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule { }
