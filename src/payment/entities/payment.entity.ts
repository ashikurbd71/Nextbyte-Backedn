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

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ unique: true })
    transactionId: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.SSLCOMMERZ
    })
    paymentMethod: PaymentMethod;

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

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Course)
    course: Course;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
