import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';

export enum SubmissionStatus {
    PENDING = 'pending',
    REVIEWED = 'reviewed',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity('assignment_submissions')
export class AssignmentSubmission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    githubLink: string;

    @Column({ nullable: true })
    liveLink: string;

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ type: 'int', nullable: true })
    marks: number;

    @Column({ type: 'text', nullable: true })
    feedback: string;

    @Column({
        type: 'enum',
        enum: SubmissionStatus,
        default: SubmissionStatus.PENDING
    })
    status: SubmissionStatus;

    @Column({ type: 'timestamp', nullable: true })
    reviewedAt: Date;

    // User information fields for easier access
    @Column({ nullable: true })
    studentName: string;

    @Column({ nullable: true })
    studentEmail: string;

    @Column({ nullable: true })
    studentPhone: string;

    // Assignment information fields for easier access
    @Column({ nullable: true })
    assignmentTitle: string;

    @Column({ nullable: true })
    moduleTitle: string;

    // Foreign key relationships
    @Column()
    studentId: number;

    @Column()
    assignmentId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'studentId' })
    student: User;

    @ManyToOne(() => Assignment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'assignmentId' })
    assignment: Assignment;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
