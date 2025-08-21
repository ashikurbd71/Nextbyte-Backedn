import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsUrl, IsPositive, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Technology, Assignment } from './shared-types';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    slugName: string;

    @IsString()
    @IsNotEmpty()
    duration: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number;

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

    @IsArray()
    @IsString({ each: true })
    whatYouWillLearn: string[];

    @IsArray()
    technologies: Technology[];

    @IsArray()
    @IsString({ each: true })
    requirements: string[];

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
    @IsUrl()
    facebookGroupLink?: string;

    @IsOptional()
    @IsArray()
    assignments?: Assignment[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    categoryId: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    instructorId: number;
}
