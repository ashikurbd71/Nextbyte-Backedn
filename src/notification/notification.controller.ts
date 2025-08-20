import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { NotificationType } from './entities/notification.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('my')
  findMyNotifications(@Request() req) {
    return this.notificationService.findByUser(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user.id);
  }

  @Get('type/:type')
  findByType(@Param('type') type: NotificationType) {
    return this.notificationService.findByType(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('mark-all-read')
  markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.remove(id);
  }

  // Specific notification creation endpoints
  @Post('assignment-feedback')
  createAssignmentFeedbackNotification(@Body() data: {
    studentId: number;
    assignmentTitle: string;
    marks: number;
    feedback: string;
    courseName: string;
  }) {
    return this.notificationService.createAssignmentFeedbackNotification(
      data.studentId,
      data.assignmentTitle,
      data.marks,
      data.feedback,
      data.courseName
    );
  }

  @Post('assignment-submitted')
  createAssignmentSubmittedNotification(@Body() data: {
    studentId: number;
    assignmentTitle: string;
    moduleName: string;
  }) {
    return this.notificationService.createAssignmentSubmittedNotification(
      data.studentId,
      data.assignmentTitle,
      data.moduleName
    );
  }

  @Post('course-enrollment')
  createCourseEnrollmentNotification(@Body() data: {
    studentId: number;
    courseName: string;
    amount: number;
  }) {
    return this.notificationService.createCourseEnrollmentNotification(
      data.studentId,
      data.courseName,
      data.amount
    );
  }

  @Post('course-completed')
  createCourseCompletedNotification(@Body() data: {
    studentId: number;
    courseName: string;
  }) {
    return this.notificationService.createCourseCompletedNotification(
      data.studentId,
      data.courseName
    );
  }

  @Post('payment-success')
  createPaymentSuccessNotification(@Body() data: {
    studentId: number;
    courseName: string;
    amount: number;
    transactionId: string;
  }) {
    return this.notificationService.createPaymentSuccessNotification(
      data.studentId,
      data.courseName,
      data.amount,
      data.transactionId
    );
  }

  @Post('payment-failed')
  createPaymentFailedNotification(@Body() data: {
    studentId: number;
    courseName: string;
    amount: number;
    reason: string;
  }) {
    return this.notificationService.createPaymentFailedNotification(
      data.studentId,
      data.courseName,
      data.amount,
      data.reason
    );
  }

  @Post('new-module-upload')
  createNewModuleUploadNotification(@Body() data: {
    studentId: number;
    moduleName: string;
    courseName: string;
  }) {
    return this.notificationService.createNewModuleUploadNotification(
      data.studentId,
      data.moduleName,
      data.courseName
    );
  }

  @Post('general')
  createGeneralNotification(@Body() data: {
    studentId: number;
    title: string;
    message: string;
    metadata?: any;
  }) {
    return this.notificationService.createGeneralNotification(
      data.studentId,
      data.title,
      data.message,
      data.metadata
    );
  }
}
