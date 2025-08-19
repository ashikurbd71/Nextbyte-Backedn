import { IsPhoneNumber } from 'class-validator';

export class ResendOtpDto {
    @IsPhoneNumber()
    phone: string;
}
