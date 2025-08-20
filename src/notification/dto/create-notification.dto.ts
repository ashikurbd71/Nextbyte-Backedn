import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { NotificationType, NotificationStatus } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  metadata?: any;

  @IsNumber()
  recipientId: number;

  @IsOptional()
  @IsBoolean()
  isEmailSent?: boolean;
}
