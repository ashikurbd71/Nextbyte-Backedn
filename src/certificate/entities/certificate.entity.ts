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
import { Course } from '../../course/entities/course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity('certificates')
export class Certificate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    certificateNumber: string;

    @Column()
    studentName: string;

    @Column()
    courseName: string;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    completionPercentage: number;

    @Column({ type: 'timestamp' })
    issuedDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiryDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    certificateUrl: string;

    @Column({ nullable: true })
    certificatePdfUrl: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'studentId' })
    student: User;

    @ManyToOne(() => Course, course => course.id)
    @JoinColumn({ name: 'courseId' })
    course: Course;

    @ManyToOne(() => Enrollment, enrollment => enrollment.id)
    @JoinColumn({ name: 'enrollmentId' })
    enrollment: Enrollment;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
