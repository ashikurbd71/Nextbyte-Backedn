import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentSubmissionsService } from './assignment-submissions.service';
import { AssignmentSubmissionsController } from './assignment-submissions.controller';
import { AssignmentSubmission } from './entities/assignment-submission.entity';
import { User } from '../users/entities/user.entity';
import { Assignment } from '../assignment/entities/assignment.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AssignmentSubmission, User, Assignment]),
        NotificationModule
    ],
    controllers: [AssignmentSubmissionsController],
    providers: [AssignmentSubmissionsService],
    exports: [AssignmentSubmissionsService],
})
export class AssignmentSubmissionsModule { }
