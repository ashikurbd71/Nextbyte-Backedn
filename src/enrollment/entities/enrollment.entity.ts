import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../course/entities/course.entity';

export enum EnrollmentStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

export enum PaymentMethod {
    SSLCOMMERZ = 'sslcommerz',
    BANK_TRANSFER = 'bank_transfer',
    CASH = 'cash'
}

@Entity('enrollments')
export class Enrollment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amountPaid: number;

    @Column({ unique: true })
    transactionId: string;

    @Column({
        type: 'enum',
        enum: EnrollmentStatus,
        default: EnrollmentStatus.PENDING
    })
    status: EnrollmentStatus;

    // Payment fields integrated directly
    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    paymentStatus: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.SSLCOMMERZ
    })
    paymentMethod: PaymentMethod;

    // SSL Commerz specific fields
    @Column({ nullable: true })
    sslcommerzSessionKey: string;

    @Column({ nullable: true })
    sslcommerzTranId: string;

    @Column({ nullable: true })
    sslcommerzValId: string;

    @Column({ nullable: true })
    sslcommerzBankTranId: string;

    @Column({ nullable: true })
    sslcommerzCardType: string;

    @Column({ nullable: true })
    sslcommerzCardIssuer: string;

    @Column({ nullable: true })
    sslcommerzCardBrand: string;

    @Column({ nullable: true })
    sslcommerzError: string;

    @Column({ type: 'json', nullable: true })
    sslcommerzResponse: any;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    failedAt: Date;

    @Column({ type: 'text', nullable: true })
    failureReason: string;

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
