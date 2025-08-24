import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '../admin/email.service';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async generateOtp(): Promise<string> {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    async sendSms(phone: string, otp: string): Promise<void> {
        try {
            const apiKey = process.env.BULKSMS_API_KEY;
            const apiUrl = 'https://bulksmsbd.net/api/smsapi';

            const response = await axios.post(apiUrl, {
                api_key: apiKey,
                type: 'text',
                number: phone, // <-- contacts নয়, number
                senderid: '8809617625025', // <-- Approved senderid
                message: `Hello!, Your NextByte Academy Sign-in OTP is: ${otp}.Please do NOT share your OTP with others!.`
            });

            console.log('SMS sent successfully:', response.data);
        } catch (error) {
            console.error('SMS sending failed:', error);
            console.log(`Development OTP for ${phone}: ${otp}`);
        }
    }


    async register(createUserDto: CreateUserDto) {
        // Check if user with phone already exists
        const existingUser = await this.userRepository.findOne({
            where: { phone: createUserDto.phone }
        });

        if (existingUser) {
            throw new BadRequestException('User with this phone number already exists');
        }

        // Check if email is provided and unique
        if (createUserDto.email) {
            const existingEmail = await this.userRepository.findOne({
                where: { email: createUserDto.email }
            });

            if (existingEmail) {
                throw new BadRequestException('User with this email already exists');
            }
        }

        // Create user
        const user = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);

        // Send welcome email if email is provided
        if (createUserDto.email) {
            try {
                await this.emailService.sendWelcomeEmail(
                    createUserDto.email,
                    createUserDto.name || 'User'
                );
            } catch (error) {
                console.error('Failed to send welcome email:', error);
                // Don't throw error, continue with user creation
            }
        }

        // Generate OTP for phone verification
        const otp = await this.generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Update user with OTP
        savedUser.lastOtp = otp;
        savedUser.otpExpiry = otpExpiry;
        await this.userRepository.save(savedUser);

        // Send OTP via SMS
        await this.sendSms(createUserDto.phone, otp);

        return {
            message: 'User registered successfully. Please verify your phone number with the OTP sent.',
            user: {
                id: savedUser.id,
                name: savedUser.name,
                phone: savedUser.phone,
                email: savedUser.email,
                isVerified: savedUser.isVerified,
            },
            phone: createUserDto.phone,
        };
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
                name: user.name,
                email: user.email,
                phone: user.phone,
                photoUrl: user.photoUrl,
                address: user.address,
                age: user.age,
                instituteName: user.instituteName,
                semester: user.semester,
                subject: user.subject,
                isVerified: user.isVerified,
                isActive: user.isActive,
                isBanned: user.isBanned,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                // Excluded: lastOtp, otpExpiry, banReason, bannedAt for security
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
