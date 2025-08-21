import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AssignmentSubmissionsService } from './assignment-submissions.service';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { DeleteSubmissionDto } from './dto/delete-submission.dto';
import { AssignmentSubmissionResponseDto, AssignmentSubmissionListResponseDto, StudentPerformanceResponseDto } from './dto/assignment-submission-response.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('assignment-submissions')
// @UseGuards(JwtAuthGuard)
export class AssignmentSubmissionsController {
    constructor(private readonly assignmentSubmissionsService: AssignmentSubmissionsService) { }

    @Post()
    async create(@Body() createAssignmentSubmissionDto: CreateAssignmentSubmissionDto): Promise<AssignmentSubmissionResponseDto> {
        return this.assignmentSubmissionsService.create(createAssignmentSubmissionDto);
    }

    @Get()
    async findAll(): Promise<AssignmentSubmissionResponseDto[]> {
        return this.assignmentSubmissionsService.findAll();
    }

    @Get('student/:studentId')
    async findByStudent(@Param('studentId', ParseIntPipe) studentId: number): Promise<AssignmentSubmissionResponseDto[]> {
        return this.assignmentSubmissionsService.findByStudent(studentId);
    }

    @Get('assignment/:assignmentId')
    async findByAssignment(@Param('assignmentId', ParseIntPipe) assignmentId: number): Promise<AssignmentSubmissionResponseDto[]> {
        return this.assignmentSubmissionsService.findByAssignment(assignmentId);
    }

    @Get('user/:userId/assignment/:assignmentId')
    async findByUserAndAssignment(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('assignmentId', ParseIntPipe) assignmentId: number
    ): Promise<AssignmentSubmissionResponseDto | null> {
        return this.assignmentSubmissionsService.findByUserAndAssignment(userId, assignmentId);
    }

    @Get('student/:studentId/performance')
    async getStudentPerformance(@Param('studentId', ParseIntPipe) studentId: number): Promise<StudentPerformanceResponseDto> {
        return this.assignmentSubmissionsService.getStudentPerformance(studentId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<AssignmentSubmissionResponseDto> {
        return this.assignmentSubmissionsService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAssignmentSubmissionDto: UpdateAssignmentSubmissionDto
    ): Promise<AssignmentSubmissionResponseDto> {
        return this.assignmentSubmissionsService.update(id, updateAssignmentSubmissionDto);
    }

    @Post('review/:id')
    async reviewSubmission(
        @Param('id', ParseIntPipe) id: number,
        @Body() reviewDto: ReviewSubmissionDto
    ): Promise<AssignmentSubmissionResponseDto> {
        return this.assignmentSubmissionsService.reviewSubmission(id, reviewDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Body() deleteDto: DeleteSubmissionDto): Promise<{ message: string }> {
        await this.assignmentSubmissionsService.remove(id, deleteDto.studentId);
        return { message: 'Assignment submission deleted successfully' };
    }
}
