import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateCertificateDto {
    @IsNotEmpty()
    @IsNumber()
    studentId: number;

    @IsNotEmpty()
    @IsNumber()
    courseId: number;

    @IsNotEmpty()
    @IsNumber()
    enrollmentId: number;

    @IsNotEmpty()
    @IsString()
    studentName: string;

    @IsNotEmpty()
    @IsString()
    courseName: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(100)
    completionPercentage: number;

    @IsOptional()
    @IsDateString()
    expiryDate?: string;

    @IsOptional()
    @IsString()
    certificateUrl?: string;

    @IsOptional()
    @IsString()
    certificatePdfUrl?: string;
}
