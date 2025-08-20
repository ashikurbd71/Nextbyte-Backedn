import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentSubmissionsService } from './assignment-submissions.service';
import { AssignmentSubmissionsController } from './assignment-submissions.controller';
import { AssignmentSubmission } from './entities/assignment-submission.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [TypeOrmModule.forFeature([AssignmentSubmission]), NotificationModule],
    controllers: [AssignmentSubmissionsController],
    providers: [AssignmentSubmissionsService],
    exports: [AssignmentSubmissionsService],
})
export class AssignmentSubmissionsModule { }
