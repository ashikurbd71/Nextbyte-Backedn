import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Category } from '../../categoris/entities/categoris.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { User } from '../../users/entities/user.entity';
import { Review } from '../../review/entities/review.entity';
import { Module } from '../../module/entities/module.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

export interface Technology {
    name: string;
    image: string;
}

export interface Assignment {
    moduleName: string;
    githubLink: string;
    liveLink: string;
}

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    slugName: string;

    @Column()
    duration: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    discountPrice: number;

    @Column({ default: 0 })
    totalJoin: number;

    @Column({ default: 0 })
    totalSeat: number;

    @Column({ type: 'simple-array' })
    whatYouWillLearn: string[];

    @Column({ type: 'json' })
    technologies: Technology[];

    @Column({ type: 'simple-array' })
    requirements: string[];

    @Column({ nullable: true })
    promoVideoUrl: string;

    @Column({ type: 'simple-array', nullable: true })
    courseVideosUrl: string[];

    @Column({ nullable: true })
    thumbnail: string;

    @Column({ nullable: true })
    facebookGroupLink: string;

    @Column({ type: 'json', nullable: true })
    assignments: Assignment[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isPublished: boolean;

    @ManyToOne(() => Category, category => category.courses)
    category: Category;

    @ManyToOne(() => Admin)
    instructor: Admin;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'course_students',
        joinColumn: { name: 'courseId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
    })
    students: User[];

    @OneToMany(() => Review, review => review.course)
    reviews: Review[];

    @OneToMany(() => Module, module => module.course)
    modules: Module[];

    @OneToMany(() => Enrollment, enrollment => enrollment.course)
    enrollments: Enrollment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
