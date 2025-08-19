import { IsString, IsEmail, IsOptional, IsNumber, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    // @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
    phone: string;

    @IsString()
    @IsOptional()
    photoUrl?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsNumber()
    @IsOptional()
    age?: number;

    @IsString()
    @IsOptional()
    instituteName?: string;

    @IsString()
    @IsOptional()
    semester?: string;

    @IsString()
    @IsOptional()
    subject?: string;
}
