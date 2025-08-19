import { IsString, IsEmail, IsOptional, IsNumber, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

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
