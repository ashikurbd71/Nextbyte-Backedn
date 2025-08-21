
import { IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty, IsPositive, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateModuleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title?: string;

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

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    courseId?: number;
}
