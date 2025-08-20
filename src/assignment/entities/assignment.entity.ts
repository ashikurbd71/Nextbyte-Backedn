import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { Module } from '../../module/entities/module.entity';
import { AssignmentSubmission } from '../../assignment-submissions/entities/assignment-submission.entity';

@Entity('assignments')
export class Assignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    githubLink: string;

    @Column({ nullable: true })
    liveLink: string;

    @Column({ type: 'int', default: 100 })
    totalMarks: number;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Module, module => module.assignments)
    module: Module;

    @OneToMany(() => AssignmentSubmission, submission => submission.assignment)
    submissions: AssignmentSubmission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
