import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../course/entities/course.entity';
import { Payment } from '../../payment/entities/payment.entity';

export enum EnrollmentStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

@Entity('enrollments')
export class Enrollment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amountPaid: number;

    @Column({ nullable: true })
    transactionId: string;

    @Column({
        type: 'enum',
        enum: EnrollmentStatus,
        default: EnrollmentStatus.PENDING
    })
    status: EnrollmentStatus;

    @Column({ type: 'timestamp', nullable: true })
    enrolledAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    @Column({ type: 'int', default: 0 })
    progress: number; // Percentage of course completion

    @ManyToOne(() => User)
    student: User;

    @ManyToOne(() => Course, course => course.enrollments)
    course: Course;

    @OneToOne(() => Payment)
    @JoinColumn()
    payment: Payment;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
