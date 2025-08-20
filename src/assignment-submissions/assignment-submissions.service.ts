import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentSubmission, SubmissionStatus } from './entities/assignment-submission.entity';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment-submission.dto';

import { NotificationService } from '../notification/notification.service';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

@Injectable()
export class AssignmentSubmissionsService {
    constructor(
        @InjectRepository(AssignmentSubmission)
        private assignmentSubmissionRepository: Repository<AssignmentSubmission>,
        private notificationService: NotificationService,
    ) { }

    async create(createAssignmentSubmissionDto: CreateAssignmentSubmissionDto, userId: number): Promise<AssignmentSubmission> {
        const submission = this.assignmentSubmissionRepository.create({
            ...createAssignmentSubmissionDto,
            student: { id: userId }
        });

        const savedSubmission = await this.assignmentSubmissionRepository.save(submission);

        // Create notification for assignment submission
        await this.notificationService.createAssignmentSubmittedNotification(
            userId,
            savedSubmission.assignment.title,
            savedSubmission.assignment.module.title
        );

        return savedSubmission;
    }

    async findAll(): Promise<AssignmentSubmission[]> {
        return await this.assignmentSubmissionRepository.find({
            relations: ['student', 'assignment', 'assignment.module'],
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: number): Promise<AssignmentSubmission> {
        const submission = await this.assignmentSubmissionRepository.findOne({
            where: { id },
            relations: ['student', 'assignment', 'assignment.module']
        });

        if (!submission) {
            throw new NotFoundException(`Assignment submission with ID ${id} not found`);
        }

        return submission;
    }

    async findByStudent(studentId: number): Promise<AssignmentSubmission[]> {
        return await this.assignmentSubmissionRepository.find({
            where: { student: { id: studentId } },
            relations: ['assignment', 'assignment.module'],
            order: { createdAt: 'DESC' }
        });
    }

    async findByAssignment(assignmentId: number): Promise<AssignmentSubmission[]> {
        return await this.assignmentSubmissionRepository.find({
            where: { assignment: { id: assignmentId } },
            relations: ['student', 'assignment'],
            order: { createdAt: 'DESC' }
        });
    }

    async update(id: number, updateAssignmentSubmissionDto: UpdateAssignmentSubmissionDto, userId: number): Promise<AssignmentSubmission> {
        const submission = await this.findOne(id);

        // Check if user owns this submission
        if (submission.student.id !== userId) {
            throw new ForbiddenException('You can only update your own submissions');
        }

        Object.assign(submission, updateAssignmentSubmissionDto);
        return await this.assignmentSubmissionRepository.save(submission);
    }

    async reviewSubmission(id: number, reviewDto: ReviewSubmissionDto): Promise<AssignmentSubmission> {
        const submission = await this.findOne(id);

        submission.marks = reviewDto.marks;
        submission.feedback = reviewDto.feedback || '';
        submission.status = reviewDto.status;
        submission.reviewedAt = new Date();

        const updatedSubmission = await this.assignmentSubmissionRepository.save(submission);

        // Create notification for assignment feedback
        await this.notificationService.createAssignmentFeedbackNotification(
            submission.student.id,
            submission.assignment.title,
            reviewDto.marks,
            reviewDto.feedback || '',
            submission.assignment.module.title
        );

        return updatedSubmission;
    }

    async remove(id: number, userId: number): Promise<void> {
        const submission = await this.findOne(id);

        // Check if user owns this submission
        if (submission.student.id !== userId) {
            throw new ForbiddenException('You can only delete your own submissions');
        }

        await this.assignmentSubmissionRepository.remove(submission);
    }

    async getStudentPerformance(studentId: number): Promise<any> {
        const submissions = await this.findByStudent(studentId);

        const totalSubmissions = submissions.length;
        const totalMarks = submissions.reduce((sum, sub) => sum + (sub.marks || 0), 0);
        const averageMarks = totalSubmissions > 0 ? totalMarks / totalSubmissions : 0;

        const statusCounts = {
            pending: submissions.filter(s => s.status === SubmissionStatus.PENDING).length,
            reviewed: submissions.filter(s => s.status === SubmissionStatus.REVIEWED).length,
            approved: submissions.filter(s => s.status === SubmissionStatus.APPROVED).length,
            rejected: submissions.filter(s => s.status === SubmissionStatus.REJECTED).length,
        };

        return {
            totalSubmissions,
            totalMarks,
            averageMarks,
            statusCounts,
            submissions: submissions.map(s => ({
                id: s.id,
                assignmentTitle: s.assignment.title,
                marks: s.marks,
                status: s.status,
                submittedAt: s.createdAt
            }))
        };
    }
}
