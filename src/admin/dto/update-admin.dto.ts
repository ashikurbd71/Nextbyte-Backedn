import { IsEmail, IsString, IsOptional, IsNumber, IsEnum, IsArray, IsUrl, MinLength } from 'class-validator';
import { JobType, AdminRole } from '../entities/admin.entity';

export class UpdateAdminDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    designation?: string;

    @IsOptional()
    @IsNumber()
    experience?: number;

    @IsOptional()
    @IsUrl()
    fbLink?: string;

    @IsOptional()
    @IsUrl()
    linkedinLink?: string;

    @IsOptional()
    @IsUrl()
    instaLink?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    expertise?: string[];

    @IsOptional()
    @IsNumber()
    salary?: number;

    @IsOptional()
    @IsEnum(JobType)
    jobType?: JobType;

    @IsOptional()
    @IsUrl()
    photoUrl?: string;

    @IsOptional()
    @IsEnum(AdminRole)
    role?: AdminRole;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
