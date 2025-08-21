import { IsNumber, IsString, IsOptional, IsBoolean, Min, Max, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @Min(1, { message: 'Rating must be at least 1' })
    @Max(5, { message: 'Rating must be at most 5' })
    @IsNotEmpty({ message: 'Rating is required' })
    rating: number;

    @IsOptional()
    @IsString({ message: 'Comment must be a string' })
    comment?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive?: boolean;

    @IsNumber()
    @IsPositive({ message: 'Course ID must be a positive number' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'Course ID is required' })
    courseId: number;


    @IsNumber()
    @IsPositive({ message: 'User ID must be a positive number' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'User ID is required' })
    userId: number;
}
