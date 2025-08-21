import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateAssignmentSubmissionDto {
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUrl()
    githubLink?: string;

    @IsOptional()
    @IsUrl()
    liveLink?: string;

    @IsOptional()
    @IsString()
    fileUrl?: string;

    @IsNumber()
    assignmentId: number;

    @IsNumber()
    studentId: number;
}
