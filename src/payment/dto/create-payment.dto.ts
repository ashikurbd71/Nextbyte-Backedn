import { IsNumber, IsString, IsOptional, IsEnum, IsDecimal } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
    @IsDecimal()
    amount: number;

    @IsString()
    transactionId: string;

    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod?: PaymentMethod;

    @IsOptional()
    @IsString()
    sslcommerzSessionKey?: string;

    @IsOptional()
    @IsString()
    sslcommerzTranId?: string;

    @IsOptional()
    @IsString()
    sslcommerzValId?: string;

    @IsOptional()
    @IsString()
    sslcommerzBankTranId?: string;

    @IsOptional()
    @IsString()
    sslcommerzCardType?: string;

    @IsOptional()
    @IsString()
    sslcommerzCardIssuer?: string;

    @IsOptional()
    @IsString()
    sslcommerzCardBrand?: string;

    @IsOptional()
    @IsString()
    sslcommerzError?: string;

    @IsOptional()
    sslcommerzResponse?: any;

    @IsNumber()
    userId: number;

    @IsNumber()
    courseId: number;
}
