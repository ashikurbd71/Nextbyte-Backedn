import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateCertificateDto {
    @IsNotEmpty()
    @IsNumber()
    enrollmentId: number;

    @IsOptional()
    @IsString()
    certificateUrl?: string;

    @IsOptional()
    @IsString()
    certificatePdfUrl?: string;
}
