import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from 'typeorm';
import { Module } from '../../module/entities/module.entity';

@Entity('lessons')
export class Lesson {
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

    @Column({ nullable: true })
    videoUrl: string;

    @Column({ nullable: true })
    thumbnail: string;

    @Column({ default: false })
    isPreview: boolean;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Module, module => module.lessons)
    module: Module;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
