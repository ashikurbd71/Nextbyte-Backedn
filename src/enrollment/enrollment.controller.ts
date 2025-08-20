import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) { }

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentService.create(createEnrollmentDto);
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  @Get('my')
  findMyEnrollments(@Request() req) {
    return this.enrollmentService.findByStudent(req.user.id);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.findByCourse(courseId);
  }

  @Get('course/:courseId/leaderboard')
  getCourseLeaderboard(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.getCourseLeaderboard(courseId);
  }

  @Get('course/:courseId/assignment-marks')
  getAssignmentMarksData(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.getAssignmentMarksData(courseId);
  }

  @Get('course/:courseId/student/:studentId/assignment-marks')
  getStudentAssignmentMarksData(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('studentId', ParseIntPipe) studentId: number
  ) {
    return this.enrollmentService.getStudentAssignmentMarksData(studentId, courseId);
  }

  @Get('course/:courseId/my-assignment-marks')
  getMyAssignmentMarksData(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Request() req
  ) {
    return this.enrollmentService.getStudentAssignmentMarksData(req.user.id, courseId);
  }

  @Get('my-performance')
  getMyPerformance(@Request() req) {
    return this.enrollmentService.getStudentPerformance(req.user.id);
  }

  @Get('statistics')
  getEnrollmentStatistics() {
    return this.enrollmentService.getEnrollmentStatistics();
  }

  @Get('motivational-message')
  getMotivationalMessage(@Request() req) {
    return this.enrollmentService.getDynamicMotivationalMessage(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentService.update(id, updateEnrollmentDto);
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { progress: number }
  ) {
    return this.enrollmentService.updateProgress(id, data.progress);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.remove(id);
  }
}
