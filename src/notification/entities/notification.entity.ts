import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
    ASSIGNMENT_FEEDBACK = 'assignment_feedback',
    ASSIGNMENT_SUBMITTED = 'assignment_submitted',
    COURSE_ENROLLMENT = 'course_enrollment',
    COURSE_COMPLETED = 'course_completed',
    CERTIFICATE_GENERATED = 'certificate_generated',
    PAYMENT_SUCCESS = 'payment_success',
    PAYMENT_FAILED = 'payment_failed',
    GENERAL = 'general'
}

export enum NotificationStatus {
    UNREAD = 'unread',
    READ = 'read',
    ARCHIVED = 'archived'
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.GENERAL
    })
    type: NotificationType;

    @Column({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.UNREAD
    })
    status: NotificationStatus;

    @Column({ type: 'json', nullable: true })
    metadata: any; // For storing additional data like assignment details, course info, etc.

    @Column({ default: false })
    isEmailSent: boolean;

    @Column({ type: 'timestamp', nullable: true })
    emailSentAt: Date;

    @ManyToOne(() => User)
    recipient: User;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
