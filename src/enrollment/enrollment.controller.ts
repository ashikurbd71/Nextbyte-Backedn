import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  Response,
  Query,
  Res
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto, SslCommerzPaymentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@ApiTags('Enrollments')
@ApiBearerAuth()
@Controller('enrollments')
// @UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new enrollment',
    description: 'Create a new enrollment for a student in a course. Payment is assumed to be already processed.'
  })
  @ApiBody({ type: CreateEnrollmentDto })
  @ApiResponse({
    status: 201,
    description: 'Enrollment created successfully'
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - student already enrolled' })
  @ApiResponse({ status: 404, description: 'Student or course not found' })
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentService.create(createEnrollmentDto);
  }

  @Post('payment/initiate')
  @ApiOperation({
    summary: 'Initiate SSL Commerz payment',
    description: 'Initiate a payment through SSL Commerz gateway and create a pending enrollment. Transaction ID, customer details, and amount will be auto-generated/populated if not provided.'
  })
  @ApiBody({ type: SslCommerzPaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Payment initiated successfully'
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - student already enrolled' })
  @ApiResponse({ status: 404, description: 'Student or course not found' })
  initiatePayment(@Body() paymentDto: SslCommerzPaymentDto) {
    return this.enrollmentService.initiateSslCommerzPayment(paymentDto);
  }

  @Post('payment/success')
  @ApiOperation({
    summary: 'Handle SSL Commerz success callback',
    description: 'Process successful payment callback from SSL Commerz'
  })
  @ApiQuery({ name: 'tran_id', description: 'Transaction ID from SSL Commerz' })
  @ApiQuery({ name: 'val_id', description: 'Validation ID from SSL Commerz' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async handlePaymentSuccess(
    @Query() query: any,
    @Res() res: ExpressResponse
  ) {
    const enrollment = await this.enrollmentService.handleSslCommerzSuccess(query);

    // Redirect to success page
    res.redirect(`${process.env.FRONTEND_URL}/payment/success?enrollmentId=${enrollment.id}`);
  }

  @Post('payment/fail')
  @ApiOperation({
    summary: 'Handle SSL Commerz failure callback',
    description: 'Process failed payment callback from SSL Commerz'
  })
  @ApiQuery({ name: 'tran_id', description: 'Transaction ID from SSL Commerz' })
  @ApiResponse({ status: 200, description: 'Payment failure processed' })
  async handlePaymentFailure(
    @Query() query: any,
    @Res() res: ExpressResponse
  ) {
    await this.enrollmentService.handleSslCommerzFailure(query);

    // Redirect to failure page
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?transactionId=${query.tran_id}`);
  }

  @Post('payment/cancel')
  @ApiOperation({
    summary: 'Handle SSL Commerz cancellation callback',
    description: 'Process cancelled payment callback from SSL Commerz'
  })
  @ApiQuery({ name: 'tran_id', description: 'Transaction ID from SSL Commerz' })
  @ApiResponse({ status: 200, description: 'Payment cancellation processed' })
  async handlePaymentCancel(
    @Query() query: any,
    @Res() res: ExpressResponse
  ) {
    await this.enrollmentService.handleSslCommerzFailure(query);

    // Redirect to cancellation page
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled?transactionId=${query.tran_id}`);
  }

  @Post('payment/ipn')
  @ApiOperation({
    summary: 'Handle SSL Commerz IPN',
    description: 'Process Instant Payment Notification from SSL Commerz (server-to-server)'
  })
  @ApiResponse({ status: 200, description: 'IPN processed successfully' })
  async handlePaymentIpn(@Body() body: any) {
    return this.enrollmentService.handleSslCommerzIpn(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all enrollments',
    description: 'Retrieve all enrollments (admin only)'
  })
  @ApiResponse({
    status: 200,
    description: 'List of all enrollments'
  })
  findAll() {
    return this.enrollmentService.findAll();
  }



  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get enrollments by student ID',
    description: 'Retrieve all enrollments for a specific student by their ID'
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'List of student enrollments'
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found'
  })
  findByStudentId(@Param('studentId') studentId: number) {
    return this.enrollmentService.findByStudent(studentId);
  }

  @Get('student/payment-history/:studentId')
  @ApiOperation({
    summary: 'Get payment history by student ID',
    description: 'Retrieve payment history for a specific student by their ID'
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student payment history'
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found'
  })
  findPaymentHistoryByStudentId(@Param('studentId') studentId: number) {
    return this.enrollmentService.findByStudent(studentId);
  }

  @Get('course/:courseId')
  @ApiOperation({
    summary: 'Get enrollments by course',
    description: 'Retrieve all enrollments for a specific course'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'List of course enrollments' })
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.findByCourse(courseId);
  }

  @Get('course/leaderboard/:courseId')
  @ApiOperation({
    summary: 'Get course leaderboard',
    description: 'Retrieve leaderboard data for a specific course based on assignment performance'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Course leaderboard'
  })
  getCourseLeaderboard(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.getCourseLeaderboard(courseId);
  }

  @Get('course/assignment-marks/:courseId')
  @ApiOperation({
    summary: 'Get assignment marks data',
    description: 'Retrieve comprehensive assignment marks data for a course'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Assignment marks data' })
  getAssignmentMarksData(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.getAssignmentMarksData(courseId);
  }

  @Get('course/:courseId/student/:studentId/assignment-marks')
  @ApiOperation({
    summary: 'Get student assignment marks',
    description: 'Retrieve assignment marks for a specific student in a course'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student assignment marks' })
  getStudentAssignmentMarksData(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('studentId', ParseIntPipe) studentId: number
  ) {
    return this.enrollmentService.getStudentAssignmentMarksData(studentId, courseId);
  }





  @Get('performance/student/:studentId')
  @ApiOperation({
    summary: 'Get performance by student ID',
    description: 'Retrieve performance statistics for a specific student by their ID'
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student performance data'
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found'
  })
  getPerformanceByStudentId(@Param('studentId') studentId: number) {
    return this.enrollmentService.getStudentPerformance(studentId);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get enrollment statistics',
    description: 'Retrieve overall enrollment statistics (admin only)'
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment statistics'
  })
  getEnrollmentStatistics() {
    return this.enrollmentService.getEnrollmentStatistics();
  }



  @Get('motivational-message/student/:studentId')
  @ApiOperation({
    summary: 'Get motivational message by student ID',
    description: 'Get a personalized motivational message for a specific student based on their performance'
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student motivational message'
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found'
  })
  getMotivationalMessageByStudentId(@Param('studentId') studentId: number) {
    return this.enrollmentService.getDynamicMotivationalMessage(studentId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get enrollment by ID',
    description: 'Retrieve a specific enrollment by its ID'
  })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment details' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update enrollment',
    description: 'Update an enrollment by ID'
  })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiBody({ type: UpdateEnrollmentDto })
  @ApiResponse({ status: 200, description: 'Enrollment updated successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentService.update(id, updateEnrollmentDto);
  }

  // @Patch('progress/:id')
  // @ApiOperation({
  //   summary: 'Update enrollment progress',
  //   description: 'Update the progress percentage for an enrollment'
  // })
  // @ApiParam({ name: 'id', description: 'Enrollment ID' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       progress: { type: 'number', minimum: 0, maximum: 100 }
  //     }
  //   }
  // })
  // @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  // @ApiResponse({ status: 404, description: 'Enrollment not found' })
  // updateProgress(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() data: { progress: number }
  // ) {
  //   return this.enrollmentService.updateProgress(id, data.progress);
  // }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete enrollment',
    description: 'Delete an enrollment by ID'
  })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.remove(id);
  }
}
