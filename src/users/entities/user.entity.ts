import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    photoUrl: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    age: number;

    @Column({ nullable: true })
    instituteName: string;

    @Column({ nullable: true })
    semester: string;

    @Column({ nullable: true })
    subject: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isBanned: boolean;

    @Column({ type: 'varchar', nullable: true })
    banReason: string | null;

    @Column({ type: 'timestamp', nullable: true })
    bannedAt: Date | null;

    @Column({ type: 'varchar', nullable: true })
    lastOtp: string | null;

    @Column({ type: 'timestamp', nullable: true })
    otpExpiry: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
