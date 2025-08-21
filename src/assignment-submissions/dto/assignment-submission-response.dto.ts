import { SubmissionStatus } from '../entities/assignment-submission.entity';

export class AssignmentSubmissionResponseDto {
    id: number;
    description?: string;
    githubLink?: string;
    liveLink?: string;
    fileUrl?: string;
    marks?: number;
    feedback?: string;
    status: SubmissionStatus;
    reviewedAt?: Date;

    // User information
    studentId: number;
    studentName?: string;
    studentEmail?: string;
    studentPhone?: string;

    // Assignment information
    assignmentId: number;
    assignmentTitle?: string;
    moduleTitle?: string;

    createdAt: Date;
    updatedAt: Date;
}

export class AssignmentSubmissionListResponseDto {
    id: number;
    assignmentTitle: string;
    moduleTitle: string;
    studentName: string;
    status: SubmissionStatus;
    marks?: number;
    submittedAt: Date;
    reviewedAt?: Date;
}

export class StudentPerformanceResponseDto {
    totalSubmissions: number;
    totalMarks: number;
    averageMarks: number;
    statusCounts: {
        pending: number;
        reviewed: number;
        approved: number;
        rejected: number;
    };
    submissions: Array<{
        id: number;
        assignmentTitle: string;
        marks?: number;
        status: SubmissionStatus;
        submittedAt: Date;
    }>;
}
