import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';

@Entity('modules')
export class Module {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: 1 })
    order: number;

    @Column({ nullable: true })
    duration: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Course, course => course.modules)
    course: Course;

    @OneToMany(() => Lesson, lesson => lesson.module)
    lessons: Lesson[];

    @OneToMany(() => Assignment, assignment => assignment.module)
    assignments: Assignment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
