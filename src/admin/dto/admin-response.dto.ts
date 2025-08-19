import { Exclude } from 'class-transformer';
import { Admin } from '../entities/admin.entity';

export class AdminResponseDto {
    id: number;
    name: string;
    email: string;
    bio: string;
    designation: string;
    experience: number;
    fbLink: string;
    linkedinLink: string;
    instaLink: string;
    expertise: string[];
    salary: number;
    jobType: string;
    photoUrl: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<AdminResponseDto>) {
        Object.assign(this, partial);
    }
}
