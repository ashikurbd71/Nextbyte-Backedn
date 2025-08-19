import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.MAIL_PORT || '465'),
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME || '',
                pass: process.env.MAIL_PASSWORD || '',
            },
        });
    }

    async sendWelcomeEmail(email: string, name: string, password: string): Promise<void> {
        const mailOptions = {
            from: process.env.MAIL_USERNAME || 'noreply@nextbyte.com',
            to: email,
            subject: 'Welcome to NextByte - Your Admin Account Created',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Welcome to NextByte!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Hello ${name},</h3>
            
            <p>Your admin account has been successfully created. Here are your login credentials:</p>
            
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${password}</p>
            </div>
            
            <p style="color: #dc3545; font-weight: bold;">Please change your password after your first login for security purposes.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/login" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Login to Your Account
              </a>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The NextByte Team</p>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 12px; margin-top: 30px;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${email}`);
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw new Error('Failed to send welcome email');
        }
    }
}
