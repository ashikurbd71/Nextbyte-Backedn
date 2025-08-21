import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { AssignmentSubmission } from '../assignment-submissions/entities/assignment-submission.entity';
import { NotificationModule } from '../notification/notification.module';
import { CertificateModule } from '../certificate/certificate.module';
import { EmailService } from '../admin/email.service';
import { User } from '../users/entities/user.entity';
import { Course } from '../course/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, AssignmentSubmission, User, Course]),
    NotificationModule,
    CertificateModule
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EmailService],
  exports: [EnrollmentService],
})
export class EnrollmentModule { }
