import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Payment } from '../payment/entities/payment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Course } from '../course/entities/course.entity';
import { Review } from '../review/entities/review.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Payment,
            Enrollment,
            User,
            Admin,
            Course,
            Review
        ])
    ],
    controllers: [StatisticsController],
    providers: [StatisticsService],
    exports: [StatisticsService],
})
export class StatisticsModule { }
