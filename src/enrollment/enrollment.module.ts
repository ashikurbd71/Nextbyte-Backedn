import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { AssignmentSubmission } from '../assignment-submissions/entities/assignment-submission.entity';
import { NotificationModule } from '../notification/notification.module';
import { PaymentModule } from '../payment/payment.module';
import { CertificateModule } from '../certificate/certificate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, AssignmentSubmission]),
    NotificationModule,
    PaymentModule,
    CertificateModule
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule { }
