
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsUrl, IsPositive, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Technology, Assignment } from './shared-types';

export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    slugName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    duration?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    discountPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    totalSeat?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    whatYouWillLearn?: string[];

    @IsOptional()
    @IsArray()
    technologies?: Technology[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    requirements?: string[];

    @IsOptional()
    @IsUrl()
    promoVideoUrl?: string;

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    courseVideosUrl?: string[];

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsArray()
    assignments?: Assignment[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    categoryId?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    instructorId?: number;
}
