import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum JobType {
    PERMANENT = 'permanent',
    CONTRACTUAL = 'contractual',
    PROJECT_BASED = 'project_based'
}

export enum AdminRole {
    MODERATOR = 'moderator',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

@Entity('admins')
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ length: 100, nullable: true })
    designation: string;

    @Column({ type: 'int', nullable: true })
    experience: number;

    @Column({ nullable: true })
    fbLink: string;

    @Column({ nullable: true })
    linkedinLink: string;

    @Column({ nullable: true })
    instaLink: string;

    @Column({ type: 'simple-array', nullable: true })
    expertise: string[];

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary: number;

    @Column({
        type: 'enum',
        enum: JobType,
        default: JobType.PERMANENT
    })
    jobType: JobType;

    @Column({ nullable: true })
    photoUrl: string;

    @Column({
        type: 'enum',
        enum: AdminRole,
        default: AdminRole.MODERATOR
    })
    role: AdminRole;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
