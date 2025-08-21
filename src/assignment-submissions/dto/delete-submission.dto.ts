import { IsNumber } from 'class-validator';

export class DeleteSubmissionDto {
    @IsNumber()
    studentId: number;
}
