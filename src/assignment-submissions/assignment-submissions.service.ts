import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentSubmission, SubmissionStatus } from './entities/assignment-submission.entity';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment-submission.dto';
import { User } from '../users/entities/user.entity';
import { Assignment } from '../assignment/entities/assignment.entity';
import { NotificationService } from '../notification/notification.service';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

@Injectable()
export class AssignmentSubmissionsService {
    constructor(
        @InjectRepository(AssignmentSubmission)
        private assignmentSubmissionRepository: Repository<AssignmentSubmission>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
        private notificationService: NotificationService,
    ) { }

    async create(createAssignmentSubmissionDto: CreateAssignmentSubmissionDto): Promise<AssignmentSubmission> {
        const studentId = createAssignmentSubmissionDto.studentId;

        // Find user and assignment
        const user = await this.findUserById(studentId);
        const assignment = await this.findAssignmentById(createAssignmentSubmissionDto.assignmentId);

        const submission = this.assignmentSubmissionRepository.create({
            ...createAssignmentSubmissionDto,
            studentId: studentId,
            assignmentId: createAssignmentSubmissionDto.assignmentId,


        });

        const savedSubmission = await this.assignmentSubmissionRepository.save(submission);

        // Create notification for assignment submission
        await this.notificationService.createAssignmentSubmittedNotification(
            studentId,
            savedSubmission.assignmentTitle,
            savedSubmission.moduleTitle
        );

        return savedSubmission;
    }

    async findAll(): Promise<AssignmentSubmission[]> {
        return await this.assignmentSubmissionRepository.find({
            relations: ['student', 'assignment'],
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: number): Promise<AssignmentSubmission> {
        const submission = await this.assignmentSubmissionRepository.findOne({
            where: { id },
            relations: ['student', 'assignment']
        });

        if (!submission) {
            throw new NotFoundException(`Assignment submission with ID ${id} not found`);
        }

        return submission;
    }

    async findByStudent(studentId: number): Promise<AssignmentSubmission[]> {
        return await this.assignmentSubmissionRepository.find({
            where: { studentId },
            relations: ['assignment'],
            order: { createdAt: 'DESC' }
        });
    }

    async findByAssignment(assignmentId: number): Promise<AssignmentSubmission[]> {
        return await this.assignmentSubmissionRepository.find({
            where: { assignmentId },
            relations: ['student'],
            order: { createdAt: 'DESC' }
        });
    }

    async findByUserAndAssignment(userId: number, assignmentId: number): Promise<AssignmentSubmission | null> {
        return await this.assignmentSubmissionRepository.findOne({
            where: { studentId: userId, assignmentId },
            relations: ['assignment']
        });
    }

    async update(id: number, updateAssignmentSubmissionDto: UpdateAssignmentSubmissionDto): Promise<AssignmentSubmission> {
        const studentId = updateAssignmentSubmissionDto.studentId;
        const submission = await this.findOne(id);

        // Check if user owns this submission
        if (submission.studentId !== studentId) {
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
            submission.studentId,
            submission.assignmentTitle,
            reviewDto.marks,
            reviewDto.feedback || '',
            submission.moduleTitle
        );

        return updatedSubmission;
    }

    async remove(id: number, userId: number): Promise<void> {
        const submission = await this.findOne(id);

        // Check if user owns this submission
        if (submission.studentId !== userId) {
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
                assignmentTitle: s.assignmentTitle,
                marks: s.marks,
                status: s.status,
                submittedAt: s.createdAt
            }))
        };
    }

    // Helper methods for finding user and assignment
    private async findUserById(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }

    private async findAssignmentById(assignmentId: number): Promise<Assignment> {
        const assignment = await this.assignmentRepository.findOne({
            where: { id: assignmentId },
            relations: ['module']
        });
        if (!assignment) {
            throw new NotFoundException(`Assignment with ID ${assignmentId} not found`);
        }
        return assignment;
    }
}
