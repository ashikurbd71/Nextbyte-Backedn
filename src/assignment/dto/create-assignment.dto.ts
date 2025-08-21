import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min, Max } from 'class-validator';

export class CreateAssignmentDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    githubLink?: string;

    @IsOptional()
    @IsString()
    liveLink?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    totalMarks?: number;

    @IsOptional()
    @IsDateString()
    dueDate?: Date;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsNumber()
    moduleId: number;
}
