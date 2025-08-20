import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
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

    @ManyToOne(() => User)
    student: User;

    @ManyToOne(() => Assignment, assignment => assignment.submissions)
    assignment: Assignment;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
