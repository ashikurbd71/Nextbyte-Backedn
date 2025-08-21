import { ApiProperty } from '@nestjs/swagger';
import { Technology, Assignment } from './shared-types';

export class CourseResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slugName: string;

    @ApiProperty()
    duration: string;

    @ApiProperty()
    price: number;

    @ApiProperty({ required: false })
    discountPrice?: number;

    @ApiProperty()
    totalJoin: number;

    @ApiProperty()
    totalSeat: number;

    @ApiProperty({ type: [String] })
    whatYouWillLearn: string[];

    @ApiProperty({ type: [Object] })
    technologies: Technology[];

    @ApiProperty({ type: [String] })
    requirements: string[];

    @ApiProperty({ required: false })
    promoVideoUrl?: string;

    @ApiProperty({ type: [String], required: false })
    courseVideosUrl?: string[];

    @ApiProperty({ required: false })
    thumbnail?: string;

    @ApiProperty({ required: false })
    facebookGroupLink?: string;

    @ApiProperty({ type: [Object], required: false })
    assignments?: Assignment[];

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isPublished: boolean;

    @ApiProperty()
    category: {
        id: number;
        name: string;
    };

    @ApiProperty()
    instructor: {
        id: number;
        name: string;
    };

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class CourseListResponseDto {
    @ApiProperty()
    success: boolean;

    @ApiProperty({ type: [CourseResponseDto] })
    data: CourseResponseDto[];

    @ApiProperty()
    count: number;
}

export class CourseSingleResponseDto {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    message: string;

    @ApiProperty({ type: CourseResponseDto })
    data: CourseResponseDto;
}

export class CourseErrorResponseDto {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    message: string;

    @ApiProperty({ required: false })
    error?: any;
}
