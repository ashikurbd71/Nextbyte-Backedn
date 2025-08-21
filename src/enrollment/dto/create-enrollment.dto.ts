import { IsNumber, IsString, IsOptional, IsEnum, IsPositive, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/enrollment.entity';

export class CreateEnrollmentDto {
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @IsNotEmpty({ message: 'Amount paid is required' })
    amountPaid: number;

    @IsString()
    @IsNotEmpty({ message: 'Transaction ID is required' })
    transactionId: string;

    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod?: PaymentMethod;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @IsNotEmpty({ message: 'Student ID is required' })
    studentId: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @IsNotEmpty({ message: 'Course ID is required' })
    courseId: number;
}

export class SslCommerzPaymentDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    amount?: number; // Will be auto-populated from course price

    @IsOptional()
    @IsString()
    transactionId?: string; // Will be auto-generated if not provided

    @IsOptional()
    @IsString()
    customerName?: string; // Will be auto-populated from user name

    @IsOptional()
    @IsString()
    customerEmail?: string; // Will be auto-populated from user email

    @IsOptional()
    @IsString()
    customerPhone?: string; // Will be auto-populated from user phone

    @IsOptional()
    @IsString()
    customerAddress?: string; // Will be auto-populated from user address

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @IsNotEmpty({ message: 'Course ID is required' })
    courseId: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @IsNotEmpty({ message: 'Student ID is required' })
    studentId: number;
}
