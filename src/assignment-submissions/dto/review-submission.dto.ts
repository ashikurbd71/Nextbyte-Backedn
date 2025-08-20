import { IsNumber, IsString, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { SubmissionStatus } from '../entities/assignment-submission.entity';

export class ReviewSubmissionDto {
    @IsNumber()
    @Min(0)
    @Max(100)
    marks: number;

    @IsOptional()
    @IsString()
    feedback?: string;

    @IsEnum(SubmissionStatus)
    status: SubmissionStatus;
}
