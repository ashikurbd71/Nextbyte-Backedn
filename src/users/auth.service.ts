import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async generateOtp(): Promise<string> {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    async sendSms(phone: string, otp: string): Promise<void> {
        try {
            // Using BulkSMS BD API
            const apiKey = process.env.BULKSMS_API_KEY;
            console.log(apiKey);
            const apiUrl = 'https://bulksmsbd.net/api/smsapi';

            const response = await axios.post(apiUrl, {
                api_key: apiKey,
                type: 'text',
                contacts: phone,
                senderid: 'NextByte',
                msg: `Your NextByte Academy verification code is: ${otp}. Valid for 5 minutes.`,
            });

            console.log('SMS sent successfully:', response.data);
        } catch (error) {
            console.error('SMS sending failed:', error);
            // In development, just log the OTP
            console.log(`Development OTP for ${phone}: ${otp}`);
        }
    }

    async login(loginDto: LoginDto) {
        const { phone } = loginDto;

        // Check if user exists
        const user = await this.userRepository.findOne({ where: { phone } });

        if (!user) {
            throw new UnauthorizedException('User not found. Please register first.');
        }

        // Generate new OTP for each login attempt
        const otp = await this.generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Update user with new OTP
        user.lastOtp = otp;
        user.otpExpiry = otpExpiry;
        await this.userRepository.save(user);

        // Send OTP via SMS
        await this.sendSms(phone, otp);

        return {
            message: 'OTP sent successfully',
            phone: phone,
        };
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const { phone, otp } = verifyOtpDto;

        const user = await this.userRepository.findOne({ where: { phone } });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.lastOtp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        if (user.otpExpiry && new Date() > user.otpExpiry) {
            throw new BadRequestException('OTP expired');
        }

        // Mark user as verified
        user.isVerified = true;
        user.lastOtp = null;
        user.otpExpiry = null;
        await this.userRepository.save(user);

        // Generate JWT token (215 days validity)
        const payload = { sub: user.id, phone: user.phone };
        const token = this.jwtService.sign(payload, {
            expiresIn: '215d',
        });

        return {
            message: 'OTP verified successfully',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        };
    }

    async resendOtp(resendOtpDto: ResendOtpDto) {
        const { phone } = resendOtpDto;

        const user = await this.userRepository.findOne({ where: { phone } });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Generate new OTP
        const otp = await this.generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Update user with new OTP
        user.lastOtp = otp;
        user.otpExpiry = otpExpiry;
        await this.userRepository.save(user);

        // Send new OTP via SMS
        await this.sendSms(phone, otp);

        return {
            message: 'New OTP sent successfully',
            phone: phone,
        };
    }


}
