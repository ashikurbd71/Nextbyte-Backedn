import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER') || 'aimspurified@gmail.com',
        pass: this.configService.get('EMAIL_PASSWORD') || 'oxcs lnyq twnf exyz',
      },
    });
  }

  async sendEmail(emailOptions: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_USER') || 'aimspurified@gmail.com',
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        text: emailOptions.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${emailOptions.to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  // Assignment Result Email Template
  async sendAssignmentResultEmail(
    to: string,
    studentName: string,
    assignmentTitle: string,
    marks: number,
    totalMarks: number,
    feedback: string,
    courseName: string,
    moduleName: string
  ): Promise<void> {
    const percentage = ((marks / totalMarks) * 100).toFixed(1);
    const grade = this.getGrade(marks, totalMarks);
    const gradeColor = this.getGradeColor(grade);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Assignment Result - ${assignmentTitle}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 20px;
            margin: 0;
          }
          .greeting {
            font-size: 18px;
            color: #555;
            margin-bottom: 25px;
          }
          .result-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .marks {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
          }
          .percentage {
            font-size: 24px;
            opacity: 0.9;
          }
          .grade {
            font-size: 28px;
            font-weight: bold;
            color: ${gradeColor};
            margin: 10px 0;
          }
          .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-label {
            font-weight: bold;
            color: #495057;
          }
          .detail-value {
            color: #6c757d;
          }
          .feedback-section {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
          }
          .feedback-title {
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
          }
          .feedback-text {
            color: #424242;
            line-height: 1.6;
          }
          .action-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .action-button:hover {
            background-color: #0056b3;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #007bff;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 NextByte</div>
            <h1 class="title">Assignment Result</h1>
          </div>
          
          <div class="greeting">
            Hello <strong>${studentName}</strong>,
          </div>
          
          <p>Your assignment has been reviewed and graded. Here are your results:</p>
          
          <div class="result-card">
            <div class="marks">${marks}/${totalMarks}</div>
            <div class="percentage">${percentage}%</div>
            <div class="grade">Grade: ${grade}</div>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Assignment:</span>
              <span class="detail-value">${assignmentTitle}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Course:</span>
              <span class="detail-value">${courseName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Module:</span>
              <span class="detail-value">${moduleName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Submitted:</span>
              <span class="detail-value">${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          ${feedback ? `
          <div class="feedback-section">
            <div class="feedback-title">📝 Instructor Feedback:</div>
            <div class="feedback-text">${feedback}</div>
          </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/assignments" class="action-button">
              View Assignment Details
            </a>
          </div>
          
          <div class="footer">
            <p>Keep up the great work! Continue learning and improving your skills.</p>
            <div class="social-links">
              <a href="#">Website</a> | 
              <a href="#">Support</a> | 
              <a href="#">Contact</a>
            </div>
            <p>&copy; 2024 NextByte Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `Assignment Result: ${assignmentTitle} - ${grade}`,
      html,
    });
  }

  // Payment Success Email Template
  async sendPaymentSuccessEmail(
    to: string,
    studentName: string,
    courseName: string,
    amount: number,
    transactionId: string,
    paymentMethod: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful - ${courseName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #28a745;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 20px;
            margin: 0;
          }
          .success-icon {
            font-size: 48px;
            color: #28a745;
            margin: 20px 0;
          }
          .greeting {
            font-size: 18px;
            color: #555;
            margin-bottom: 25px;
          }
          .success-card {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .amount {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
          }
          .status {
            font-size: 24px;
            opacity: 0.9;
          }
          .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-label {
            font-weight: bold;
            color: #495057;
          }
          .detail-value {
            color: #6c757d;
          }
          .course-info {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
          }
          .course-title {
            font-weight: bold;
            color: #155724;
            margin-bottom: 10px;
          }
          .course-description {
            color: #155724;
            line-height: 1.6;
          }
          .action-button {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .action-button:hover {
            background-color: #218838;
          }
          .next-steps {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
          }
          .next-steps-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
          }
          .next-steps-list {
            color: #856404;
            margin: 0;
            padding-left: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #28a745;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 NextByte</div>
            <h1 class="title">Payment Successful!</h1>
          </div>
          
          <div style="text-align: center;">
            <div class="success-icon">✅</div>
          </div>
          
          <div class="greeting">
            Hello <strong>${studentName}</strong>,
          </div>
          
          <p>Your payment has been processed successfully! Welcome to your new course.</p>
          
          <div class="success-card">
            <div class="amount">৳${amount}</div>
            <div class="status">Payment Successful</div>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Course:</span>
              <span class="detail-value">${courseName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">৳${amount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">${paymentMethod}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Transaction ID:</span>
              <span class="detail-value">${transactionId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div class="course-info">
            <div class="course-title">📚 Course: ${courseName}</div>
            <div class="course-description">
              You now have full access to all course materials, videos, assignments, and instructor support. 
              Start your learning journey today!
            </div>
          </div>
          
          <div class="next-steps">
            <div class="next-steps-title">🚀 What's Next?</div>
            <ul class="next-steps-list">
              <li>Access your course dashboard</li>
              <li>Watch the first module videos</li>
              <li>Complete your first assignment</li>
              <li>Join the course community</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard" class="action-button">
              Start Learning Now
            </a>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing NextByte! We're excited to be part of your learning journey.</p>
            <div class="social-links">
              <a href="#">Website</a> | 
              <a href="#">Support</a> | 
              <a href="#">Contact</a>
            </div>
            <p>&copy; 2024 NextByte Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `Payment Successful - Welcome to ${courseName}!`,
      html,
    });
  }

  // Enrollment Welcome Email Template
  async sendEnrollmentWelcomeEmail(
    to: string,
    studentName: string,
    courseName: string,
    instructorName: string,
    facebookGroupLink: string,
    courseDuration: string,
    coursePrice: number
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${courseName} - NextByte</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 20px;
            margin: 0;
          }
          .welcome-icon {
            font-size: 48px;
            color: #007bff;
            margin: 20px 0;
          }
          .greeting {
            font-size: 18px;
            color: #555;
            margin-bottom: 25px;
          }
          .welcome-card {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .course-name {
            font-size: 28px;
            font-weight: bold;
            margin: 10px 0;
          }
          .welcome-text {
            font-size: 18px;
            opacity: 0.9;
          }
          .course-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-label {
            font-weight: bold;
            color: #495057;
          }
          .detail-value {
            color: #6c757d;
          }
          .facebook-section {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
          }
          .facebook-title {
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
            font-size: 18px;
          }
          .facebook-text {
            color: #1976d2;
            line-height: 1.6;
            margin-bottom: 15px;
          }
          .facebook-button {
            display: inline-block;
            background-color: #1877f2;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px 0;
            transition: background-color 0.3s;
          }
          .facebook-button:hover {
            background-color: #166fe5;
          }
          .instructions-section {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
          }
          .instructions-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .instructions-list {
            color: #856404;
            margin: 0;
            padding-left: 20px;
          }
          .instructions-list li {
            margin: 8px 0;
          }
          .action-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .action-button:hover {
            background-color: #0056b3;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #007bff;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 NextByte</div>
            <h1 class="title">Welcome to Your Course!</h1>
          </div>
          
          <div style="text-align: center;">
            <div class="welcome-icon">🎉</div>
          </div>
          
          <div class="greeting">
            Hello <strong>${studentName}</strong>,
          </div>
          
          <p>Congratulations! You have successfully enrolled in your course. We're excited to have you join our learning community!</p>
          
          <div class="welcome-card">
            <div class="course-name">${courseName}</div>
            <div class="welcome-text">Welcome to your learning journey!</div>
          </div>
          
          <div class="course-details">
            <div class="detail-row">
              <span class="detail-label">Course:</span>
              <span class="detail-value">${courseName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Instructor:</span>
              <span class="detail-value">${instructorName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${courseDuration}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Price:</span>
              <span class="detail-value">৳${coursePrice}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Enrollment Date:</span>
              <span class="detail-value">${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          ${facebookGroupLink ? `
          <div class="facebook-section">
            <div class="facebook-title">👥 Join Our Facebook Community!</div>
            <div class="facebook-text">
              Connect with fellow <strong>${courseName}</strong> students, ask questions, share your progress, and get support from your instructor and peers in our dedicated Facebook group for this course.
            </div>
            <div style="text-align: center;">
              <a href="${facebookGroupLink}" class="facebook-button" target="_blank">
                📘 Join ${courseName} Facebook Group
              </a>
            </div>
          </div>
          ` : ''}
          
          <div class="instructions-section">
            <div class="instructions-title">🚀 Getting Started Instructions:</div>
            <ul class="instructions-list">
              <li><strong>Access Your Course:</strong> Log in to your dashboard and navigate to "My Courses"</li>
              <li><strong>Watch Videos:</strong> Start with the first module and watch all video lessons</li>
              <li><strong>Complete Assignments:</strong> Submit your assignments on time for review</li>
              <li><strong>Join Discussions:</strong> Participate in course discussions and ask questions</li>
              <li><strong>Track Progress:</strong> Monitor your learning progress in the dashboard</li>
              <li><strong>Get Support:</strong> Reach out to your instructor or use the support system</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard" class="action-button">
              Start Learning Now
            </a>
          </div>
          
          <div class="footer">
            <p>Welcome to NextByte! We're here to support your learning journey every step of the way.</p>
            <div class="social-links">
              <a href="#">Website</a> | 
              <a href="#">Support</a> | 
              <a href="#">Contact</a> | 
              <a href="#">Help Center</a>
            </div>
            <p>&copy; 2024 NextByte Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `Welcome to ${courseName} - NextByte Learning Platform! 🎓`,
      html,
    });
  }

  // Payment Failed Email Template
  async sendPaymentFailedEmail(
    to: string,
    studentName: string,
    courseName: string,
    amount: number,
    reason: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Failed - ${courseName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #dc3545;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #dc3545;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 20px;
            margin: 0;
          }
          .error-icon {
            font-size: 48px;
            color: #dc3545;
            margin: 20px 0;
          }
          .greeting {
            font-size: 18px;
            color: #555;
            margin-bottom: 25px;
          }
          .error-card {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .amount {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
          }
          .status {
            font-size: 24px;
            opacity: 0.9;
          }
          .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-label {
            font-weight: bold;
            color: #495057;
          }
          .detail-value {
            color: #6c757d;
          }
          .error-info {
            background-color: #f8d7da;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #dc3545;
          }
          .error-title {
            font-weight: bold;
            color: #721c24;
            margin-bottom: 10px;
          }
          .error-text {
            color: #721c24;
            line-height: 1.6;
          }
          .action-button {
            display: inline-block;
            background-color: #dc3545;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .action-button:hover {
            background-color: #c82333;
          }
          .help-section {
            background-color: #d1ecf1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #17a2b8;
          }
          .help-title {
            font-weight: bold;
            color: #0c5460;
            margin-bottom: 10px;
          }
          .help-list {
            color: #0c5460;
            margin: 0;
            padding-left: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #dc3545;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 NextByte</div>
            <h1 class="title">Payment Failed</h1>
          </div>
          
          <div style="text-align: center;">
            <div class="error-icon">❌</div>
          </div>
          
          <div class="greeting">
            Hello <strong>${studentName}</strong>,
          </div>
          
          <p>We're sorry, but your payment for the course could not be processed. Here are the details:</p>
          
          <div class="error-card">
            <div class="amount">৳${amount}</div>
            <div class="status">Payment Failed</div>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Course:</span>
              <span class="detail-value">${courseName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">৳${amount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div class="error-info">
            <div class="error-title">⚠️ Reason for Failure:</div>
            <div class="error-text">${reason}</div>
          </div>
          
          <div class="help-section">
            <div class="help-title">💡 Need Help?</div>
            <ul class="help-list">
              <li>Check your payment method details</li>
              <li>Ensure sufficient funds in your account</li>
              <li>Try a different payment method</li>
              <li>Contact our support team</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/retry" class="action-button">
              Try Payment Again
            </a>
          </div>
          
          <div class="footer">
            <p>Don't worry, you can try the payment again anytime. We're here to help!</p>
            <div class="social-links">
              <a href="#">Website</a> | 
              <a href="#">Support</a> | 
              <a href="#">Contact</a>
            </div>
            <p>&copy; 2024 NextByte Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `Payment Failed - ${courseName}`,
      html,
    });
  }

  // General notification email template
  async sendGeneralNotificationEmail(
    to: string,
    studentName: string,
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 20px;
            margin: 0;
          }
          .greeting {
            font-size: 18px;
            color: #555;
            margin-bottom: 25px;
          }
          .message-content {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
          }
          .action-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .action-button:hover {
            background-color: #0056b3;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #007bff;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 NextByte</div>
            <h1 class="title">${title}</h1>
          </div>
          
          <div class="greeting">
            Hello <strong>${studentName}</strong>,
          </div>
          
          <div class="message-content">
            ${message}
          </div>
          
          ${actionUrl && actionText ? `
          <div style="text-align: center;">
            <a href="${actionUrl}" class="action-button">
              ${actionText}
            </a>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Thank you for being part of NextByte Learning Platform!</p>
            <div class="social-links">
              <a href="#">Website</a> | 
              <a href="#">Support</a> | 
              <a href="#">Contact</a>
            </div>
            <p>&copy; 2024 NextByte Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: title,
      html,
    });
  }

  // Welcome Email Template
  async sendWelcomeEmail(
    to: string,
    studentName: string,
    verificationCode?: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NextByte Learning Platform</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 24px;
            margin: 0;
          }
          .welcome-icon {
            font-size: 48px;
            color: #007bff;
            margin: 20px 0;
          }
          .greeting {
            font-size: 20px;
            color: #555;
            margin-bottom: 25px;
            text-align: center;
          }
          .welcome-card {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .welcome-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          .welcome-subtitle {
            font-size: 16px;
            opacity: 0.9;
          }
          .features {
            background-color: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
          }
          .features-title {
            font-weight: bold;
            color: #495057;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .feature-item {
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            align-items: center;
          }
          .feature-item:last-child {
            border-bottom: none;
          }
          .feature-icon {
            font-size: 20px;
            margin-right: 15px;
            color: #007bff;
          }
          .verification-section {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
            text-align: center;
          }
          .verification-title {
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
          }
          .verification-code {
            font-size: 24px;
            font-weight: bold;
            color: #1976d2;
            background-color: white;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
            letter-spacing: 3px;
          }
          .action-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
            font-size: 16px;
          }
          .action-button:hover {
            background-color: #0056b3;
          }
          .next-steps {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
          }
          .next-steps-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
          }
          .next-steps-list {
            color: #856404;
            margin: 0;
            padding-left: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #007bff;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 NextByte</div>
            <h1 class="title">Welcome to NextByte!</h1>
          </div>
          
          <div style="text-align: center;">
            <div class="welcome-icon">🎉</div>
          </div>
          
          <div class="greeting">
            Hello <strong>${studentName}</strong>! 👋
          </div>
          
          <div class="welcome-card">
            <div class="welcome-title">Welcome to Your Learning Journey!</div>
            <div class="welcome-subtitle">
              We're excited to have you join our community of learners. 
              Get ready to unlock your potential with our comprehensive courses.
            </div>
          </div>
          
          <div class="features">
            <div class="features-title">🚀 What You'll Get:</div>
            <ul class="feature-list">
              <li class="feature-item">
                <span class="feature-icon">📚</span>
                <span>Access to premium courses with expert instructors</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">🎥</span>
                <span>High-quality video lessons and practical exercises</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">💻</span>
                <span>Hands-on projects and real-world assignments</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">👥</span>
                <span>Community support and peer learning</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">🏆</span>
                <span>Certificates upon course completion</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">📱</span>
                <span>Learn at your own pace, anytime, anywhere</span>
              </li>
            </ul>
            </div>
            
          ${verificationCode ? `
          <div class="verification-section">
            <div class="verification-title">📧 Verify Your Email Address</div>
            <p>To complete your registration, please use this verification code:</p>
            <div class="verification-code">${verificationCode}</div>
            <p>This code will expire in 10 minutes for security purposes.</p>
          </div>
          ` : ''}
          
          <div class="next-steps">
            <div class="next-steps-title">🎯 Your Next Steps:</div>
            <ul class="next-steps-list">
              <li>Complete your profile setup</li>
              <li>Browse our course catalog</li>
              <li>Enroll in your first course</li>
              <li>Join our learning community</li>
              <li>Start your learning journey!</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard" class="action-button">
              Explore Courses Now
              </a>
            </div>
            
          <div class="footer">
            <p>We're here to support your learning journey every step of the way!</p>
            <div class="social-links">
              <a href="#">Website</a> | 
              <a href="#">Support</a> | 
              <a href="#">Contact</a> | 
              <a href="#">Help Center</a>
            </div>
            <p>&copy; 2024 NextByte Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: 'Welcome to NextByte Learning Platform! 🎓',
      html,
    });
  }

  // Admin Welcome Email Template
  async sendAdminWelcomeEmail(
    to: string,
    adminName: string,
    email: string,
    password: string,
    role: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NextByte Admin Panel</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #28a745;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #28a745;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 24px;
            margin: 0;
          }
          .welcome-icon {
            font-size: 48px;
            color: #28a745;
            margin: 20px 0;
          }
          .greeting {
            font-size: 20px;
            color: #555;
            margin-bottom: 25px;
            text-align: center;
          }
          .welcome-card {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
          }
          .welcome-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          .welcome-subtitle {
            font-size: 16px;
            opacity: 0.9;
          }
          .credentials-section {
            background-color: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #28a745;
          }
          .credentials-title {
            font-weight: bold;
            color: #495057;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .credential-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .credential-item:last-child {
            border-bottom: none;
          }
          .credential-label {
            font-weight: bold;
            color: #495057;
          }
          .credential-value {
            background-color: #e9ecef;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            color: #495057;
          }
          .role-badge {
            background-color: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
          }
          .features {
            background-color: #e8f5e8;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
          }
          .features-title {
            font-weight: bold;
            color: #155724;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .feature-item {
            padding: 10px 0;
            border-bottom: 1px solid #c3e6cb;
            display: flex;
            align-items: center;
          }
          .feature-item:last-child {
            border-bottom: none;
          }
          .feature-icon {
            font-size: 20px;
            margin-right: 15px;
            color: #28a745;
          }
          .security-notice {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
          }
          .security-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 10px;
          }
          .security-text {
            color: #856404;
            margin: 0;
          }
          .action-button {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
            font-size: 16px;
          }
          .action-button:hover {
            background-color: #218838;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #28a745;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 NextByte</div>
            <h1 class="title">Welcome to Admin Panel!</h1>
          </div>
          
          <div style="text-align: center;">
            <div class="welcome-icon">👨‍💼</div>
          </div>
          
          <div class="greeting">
            Hello <strong>${adminName}</strong>! 👋
          </div>
          
          <div class="welcome-card">
            <div class="welcome-title">Welcome to NextByte Admin Team!</div>
            <div class="welcome-subtitle">
              You have been successfully registered as an administrator. 
              Welcome to our team of educators and course creators!
            </div>
            <div style="margin-top: 15px;">
              <span class="role-badge">${role}</span>
            </div>
          </div>
          
          <div class="credentials-section">
            <div class="credentials-title">🔐 Your Login Credentials:</div>
            <div class="credential-item">
              <span class="credential-label">Email:</span>
              <span class="credential-value">${email}</span>
            </div>
            <div class="credential-item">
              <span class="credential-label">Password:</span>
              <span class="credential-value">${password}</span>
            </div>
            <div class="credential-item">
              <span class="credential-label">Role:</span>
              <span class="credential-value">${role}</span>
            </div>
          </div>
          
          <div class="security-notice">
            <div class="security-title">⚠️ Security Notice:</div>
            <div class="security-text">
              Please change your password after your first login for security purposes. 
              Keep your credentials safe and never share them with others.
            </div>
          </div>
          
          <div class="features">
            <div class="features-title">🚀 Admin Panel Features:</div>
            <ul class="feature-list">
              <li class="feature-item">
                <span class="feature-icon">📚</span>
                <span>Create and manage courses</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">👥</span>
                <span>Manage students and enrollments</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">📊</span>
                <span>View analytics and reports</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">💬</span>
                <span>Review assignments and provide feedback</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">⚙️</span>
                <span>Manage system settings</span>
              </li>
              <li class="feature-item">
                <span class="feature-icon">📈</span>
                <span>Monitor platform performance</span>
              </li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/admin/login" class="action-button">
              Access Admin Panel
            </a>
          </div>
          
          <div class="footer">
            <p>Welcome to the NextByte team! We're excited to have you on board.</p>
            <div class="social-links">
              <a href="#">Website</a> | 
              <a href="#">Support</a> | 
              <a href="#">Documentation</a> | 
              <a href="#">Contact</a>
            </div>
            <p>&copy; 2024 NextByte Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: 'Welcome to NextByte Admin Panel! 👨‍💼',
      html,
    });
  }

  private getGrade(marks: number, totalMarks: number): string {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  }

  private getGradeColor(grade: string): string {
    switch (grade) {
      case 'A+':
      case 'A':
        return '#28a745';
      case 'B+':
      case 'B':
        return '#17a2b8';
      case 'C+':
      case 'C':
        return '#ffc107';
      default:
        return '#dc3545';
    }
  }
}
