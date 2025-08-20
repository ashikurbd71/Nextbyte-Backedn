import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { AssignmentSubmissionsService } from './assignment-submissions.service';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('assignment-submissions')
@UseGuards(JwtAuthGuard)
export class AssignmentSubmissionsController {
    constructor(private readonly assignmentSubmissionsService: AssignmentSubmissionsService) { }

    @Post()
    create(@Body() createAssignmentSubmissionDto: CreateAssignmentSubmissionDto, @Request() req) {
        return this.assignmentSubmissionsService.create(createAssignmentSubmissionDto, req.user.id);
    }

    @Get()
    findAll() {
        return this.assignmentSubmissionsService.findAll();
    }

    @Get('my')
    findMySubmissions(@Request() req) {
        return this.assignmentSubmissionsService.findByStudent(req.user.id);
    }

    @Get('assignment/:assignmentId')
    findByAssignment(@Param('assignmentId', ParseIntPipe) assignmentId: number) {
        return this.assignmentSubmissionsService.findByAssignment(assignmentId);
    }

    @Get('my-performance')
    getMyPerformance(@Request() req) {
        return this.assignmentSubmissionsService.getStudentPerformance(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.assignmentSubmissionsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateAssignmentSubmissionDto: UpdateAssignmentSubmissionDto, @Request() req) {
        return this.assignmentSubmissionsService.update(id, updateAssignmentSubmissionDto, req.user.id);
    }

    @Post(':id/review')
    reviewSubmission(@Param('id', ParseIntPipe) id: number, @Body() reviewDto: ReviewSubmissionDto) {
        return this.assignmentSubmissionsService.reviewSubmission(id, reviewDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.assignmentSubmissionsService.remove(id, req.user.id);
    }
}
