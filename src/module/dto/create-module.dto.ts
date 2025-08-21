import { IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty, IsPositive, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModuleDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    order?: number;

    @IsOptional()
    @IsString()
    duration?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    courseId: number;
}
