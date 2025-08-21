import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EmailService } from '../admin/email.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) { }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    const savedNotification = await this.notificationRepository.save(notification);

    // Send email notification
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      relations: ['recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['recipient']
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { recipient: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { type },
      relations: ['recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.READ;
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { recipient: { id: userId }, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ }
    );
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { recipient: { id: userId }, status: NotificationStatus.UNREAD }
    });
  }

  // Specific notification creation methods
  async createAssignmentFeedbackNotification(
    studentId: number,
    assignmentTitle: string,
    marks: number,
    feedback: string,
    courseName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Assignment Feedback Received',
      message: `Your assignment "${assignmentTitle}" has been reviewed. You received ${marks} marks. ${feedback ? `Feedback: ${feedback}` : ''}`,
      type: NotificationType.ASSIGNMENT_FEEDBACK,
      recipient: user,
      metadata: {
        assignmentTitle,
        marks,
        feedback,
        courseName
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createAssignmentSubmittedNotification(
    studentId: number,
    assignmentTitle: string,
    moduleName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Assignment Submitted Successfully',
      message: `Your assignment "${assignmentTitle}" for module "${moduleName}" has been submitted successfully and is under review.`,
      type: NotificationType.ASSIGNMENT_SUBMITTED,
      recipient: user,
      metadata: {
        assignmentTitle,
        moduleName
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createCourseEnrollmentNotification(
    studentId: number,
    courseName: string,
    amount: number
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Course Enrollment Successful',
      message: `You have successfully enrolled in "${courseName}" for ${amount} BDT. Welcome to the course!`,
      type: NotificationType.COURSE_ENROLLMENT,
      recipient: user,
      metadata: {
        courseName,
        amount
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createCourseCompletedNotification(
    studentId: number,
    courseName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Course Completed!',
      message: `Congratulations! You have successfully completed "${courseName}". Well done!`,
      type: NotificationType.COURSE_COMPLETED,
      recipient: user,
      metadata: {
        courseName
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createCertificateGeneratedNotification(
    studentId: number,
    courseName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Certificate Generated!',
      message: `Your certificate for "${courseName}" has been automatically generated and is ready for download. Congratulations on your achievement!`,
      type: NotificationType.CERTIFICATE_GENERATED,
      recipient: user,
      metadata: {
        courseName,
        certificateGenerated: true
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createPaymentSuccessNotification(
    studentId: number,
    courseName: string,
    amount: number,
    transactionId: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Payment Successful',
      message: `Your payment of ${amount} BDT for "${courseName}" has been processed successfully. Transaction ID: ${transactionId}`,
      type: NotificationType.PAYMENT_SUCCESS,
      recipient: user,
      metadata: {
        courseName,
        amount,
        transactionId
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createPaymentFailedNotification(
    studentId: number,
    courseName: string,
    amount: number,
    reason: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'Payment Failed',
      message: `Your payment of ${amount} BDT for "${courseName}" has failed. Reason: ${reason}. Please try again.`,
      type: NotificationType.PAYMENT_FAILED,
      recipient: user,
      metadata: {
        courseName,
        amount,
        reason
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createNewModuleUploadNotification(
    studentId: number,
    moduleName: string,
    courseName: string
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title: 'New Module Available',
      message: `A new module "${moduleName}" has been added to "${courseName}". Check it out!`,
      type: NotificationType.GENERAL,
      recipient: user,
      metadata: {
        moduleName,
        courseName
      }
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  async createGeneralNotification(
    studentId: number,
    title: string,
    message: string,
    metadata?: any
  ): Promise<Notification> {
    // Load the user with email to ensure we have the recipient's email
    const user = await this.userRepository.findOne({ where: { id: studentId } });
    if (!user) {
      throw new Error(`User with ID ${studentId} not found`);
    }

    const notification = this.notificationRepository.create({
      title,
      message,
      type: NotificationType.GENERAL,
      recipient: user,
      metadata
    });

    const savedNotification = await this.notificationRepository.save(notification);
    await this.sendNotificationEmail(savedNotification);

    return savedNotification;
  }

  private async sendNotificationEmail(notification: Notification): Promise<void> {
    try {
      // Ensure the recipient relation is loaded
      const notificationWithRecipient = await this.notificationRepository.findOne({
        where: { id: notification.id },
        relations: ['recipient']
      });

      if (!notificationWithRecipient || !notificationWithRecipient.recipient) {
        console.error('Notification or recipient not found for email sending');
        return;
      }

      const emailHTML = this.generateEmailHTML(notificationWithRecipient);
      const actionButton = this.getEmailActionButton(notificationWithRecipient);

      await this.emailService.sendEmail({
        to: notificationWithRecipient.recipient.email,
        subject: notificationWithRecipient.title,
        html: emailHTML + actionButton
      });

      notification.isEmailSent = true;
      notification.emailSentAt = new Date();
      await this.notificationRepository.save(notification);
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  }

  private generateEmailHTML(notification: Notification): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">${notification.title}</h2>
        <p style="color: #666; line-height: 1.6;">${notification.message}</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated notification from NextByte Learning Platform.
        </p>
      </div>
    `;
  }

  private getEmailActionButton(notification: Notification): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    switch (notification.type) {
      case NotificationType.ASSIGNMENT_FEEDBACK:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/assignments" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Assignment
            </a>
          </div>
        `;
      case NotificationType.COURSE_ENROLLMENT:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/courses" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Start Learning
            </a>
          </div>
        `;
      case NotificationType.CERTIFICATE_GENERATED:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/certificates" style="background-color: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Certificate
            </a>
          </div>
        `;
      case NotificationType.PAYMENT_SUCCESS:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/dashboard" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Go to Dashboard
            </a>
          </div>
        `;
      default:
        return `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${baseUrl}/notifications" style="background-color: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View All Notifications
            </a>
          </div>
        `;
    }
  }
}
