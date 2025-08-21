import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus, PaymentStatus, PaymentMethod } from './entities/enrollment.entity';
import { CreateEnrollmentDto, SslCommerzPaymentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { NotificationService } from '../notification/notification.service';
import { CertificateService } from '../certificate/certificate.service';
import { AssignmentSubmission } from '../assignment-submissions/entities/assignment-submission.entity';
import { EmailService } from '../admin/email.service';
import { User } from '../users/entities/user.entity';
import { Course } from '../course/entities/course.entity';
import axios from 'axios';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(AssignmentSubmission)
    private assignmentSubmissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private notificationService: NotificationService,
    private certificateService: CertificateService,
    private emailService: EmailService,
  ) { }

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    // Find student and course
    const student = await this.userRepository.findOne({
      where: { id: createEnrollmentDto.studentId }
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${createEnrollmentDto.studentId} not found`);
    }

    const course = await this.courseRepository.findOne({
      where: { id: createEnrollmentDto.courseId }
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${createEnrollmentDto.courseId} not found`);
    }

    // Check if already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { student: { id: createEnrollmentDto.studentId }, course: { id: createEnrollmentDto.courseId } }
    });

    if (existingEnrollment) {
      throw new ForbiddenException('Student is already enrolled in this course');
    }

    const enrollment = this.enrollmentRepository.create({
      ...createEnrollmentDto,
      student: student,
      course: course,
      enrolledAt: new Date(),
      status: EnrollmentStatus.ACTIVE,
      paymentStatus: PaymentStatus.SUCCESS, // Assuming payment is already processed
      paymentMethod: createEnrollmentDto.paymentMethod || PaymentMethod.SSLCOMMERZ,
      paidAt: new Date()
    });

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    // Load the enrollment with course and instructor details for email
    const enrollmentWithDetails = await this.enrollmentRepository.findOne({
      where: { id: savedEnrollment.id },
      relations: ['student', 'course', 'course.instructor', 'course.modules', 'course.modules.assignments', 'course.modules.lessons']
    });

    if (!enrollmentWithDetails) {
      throw new NotFoundException('Enrollment not found after creation');
    }

    // Send enrollment notification
    await this.notificationService.createCourseEnrollmentNotification(
      enrollmentWithDetails.student.id,
      enrollmentWithDetails.course.name,
      enrollmentWithDetails.amountPaid
    );

    // Send welcome email with course details and Facebook group link
    try {
      await this.emailService.sendEnrollmentWelcomeEmail(
        enrollmentWithDetails.student.email,
        enrollmentWithDetails.student.name,
        enrollmentWithDetails.course.name,
        enrollmentWithDetails.course.instructor.name,
        enrollmentWithDetails.course.facebookGroupLink || '',
        enrollmentWithDetails.course.duration,
        enrollmentWithDetails.amountPaid
      );
    } catch (error) {
      // Log error but don't fail the enrollment process
      console.error('Failed to send welcome email:', error.message);
    }

    return enrollmentWithDetails;
  }

  private generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN_${timestamp}_${random}`;
  }

  async initiateSslCommerzPayment(paymentDto: SslCommerzPaymentDto): Promise<any> {
    // Find student and course
    const student = await this.userRepository.findOne({
      where: { id: paymentDto.studentId }
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${paymentDto.studentId} not found`);
    }

    const course = await this.courseRepository.findOne({
      where: { id: paymentDto.courseId }
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${paymentDto.courseId} not found`);
    }

    // Auto-populate customer details and amount from user and course data
    const customerName = paymentDto.customerName || student.name || 'Unknown Customer';
    const customerEmail = paymentDto.customerEmail || student.email || '';
    const customerPhone = paymentDto.customerPhone || student.phone || '';
    const customerAddress = paymentDto.customerAddress || student.address || 'N/A';

    // Use course price if amount is not provided, prioritize discount price if available
    const amount = paymentDto.amount || (course.discountPrice || course.price);

    // Auto-generate transaction ID if not provided
    const transactionId = paymentDto.transactionId || this.generateTransactionId();

    // Check if already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { student: { id: paymentDto.studentId }, course: { id: paymentDto.courseId } }
    });

    if (existingEnrollment) {
      throw new ForbiddenException('Student is already enrolled in this course');
    }

    // Create pending enrollment
    const enrollment = this.enrollmentRepository.create({
      amountPaid: amount,
      transactionId: transactionId,
      student: student,
      course: course,
      status: EnrollmentStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.SSLCOMMERZ
    });

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    // Prepare SSL Commerz payment data
    const sslCommerzData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: amount,
      currency: 'BDT',
      tran_id: transactionId,
      product_category: 'education',
      cus_name: customerName,
      cus_email: customerEmail,
      cus_add1: customerAddress,
      cus_phone: customerPhone,
      ship_name: customerName,
      ship_add1: customerAddress,
      ship_phone: customerPhone,
      value_a: savedEnrollment.id.toString(), // Enrollment ID
      value_b: paymentDto.courseId.toString(),
      value_c: paymentDto.studentId.toString(),
      success_url: `${process.env.APP_URL}/api/enrollments/payment/success`,
      fail_url: `${process.env.APP_URL}/api/enrollments/payment/fail`,
      cancel_url: `${process.env.APP_URL}/api/enrollments/payment/cancel`,
      ipn_url: `${process.env.APP_URL}/api/enrollments/payment/ipn`,
    };

    try {
      const response = await axios.post(
        'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
        sslCommerzData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.status === 'VALID') {
        // Update enrollment with session key
        await this.enrollmentRepository.update(savedEnrollment.id, {
          sslcommerzSessionKey: response.data.sessionkey
        });

        return {
          enrollmentId: savedEnrollment.id,
          sessionKey: response.data.sessionkey,
          gatewayUrl: response.data.GatewayPageURL,
          status: 'initiated'
        };
      } else {
        throw new Error('SSL Commerz payment initiation failed');
      }
    } catch (error) {
      // Update enrollment status to failed
      await this.enrollmentRepository.update(savedEnrollment.id, {
        paymentStatus: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureReason: error.message
      });

      throw new Error(`Payment initiation failed: ${error.message}`);
    }
  }

  async handleSslCommerzSuccess(transactionData: any): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { transactionId: transactionData.tran_id },
      relations: ['student', 'course', 'course.instructor']
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Update enrollment with payment success details
    await this.enrollmentRepository.update(enrollment.id, {
      paymentStatus: PaymentStatus.SUCCESS,
      status: EnrollmentStatus.ACTIVE,
      enrolledAt: new Date(),
      paidAt: new Date(),
      sslcommerzTranId: transactionData.tran_id,
      sslcommerzValId: transactionData.val_id,
      sslcommerzBankTranId: transactionData.bank_tran_id,
      sslcommerzCardType: transactionData.card_type,
      sslcommerzCardIssuer: transactionData.card_issuer,
      sslcommerzCardBrand: transactionData.card_brand,
      sslcommerzResponse: transactionData
    });

    // Reload enrollment with updated data
    const updatedEnrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollment.id },
      relations: ['student', 'course', 'course.instructor']
    });

    if (!updatedEnrollment) {
      throw new NotFoundException('Enrollment not found after update');
    }

    // Send notifications and emails
    await this.notificationService.createCourseEnrollmentNotification(
      updatedEnrollment.student.id,
      updatedEnrollment.course.name,
      updatedEnrollment.amountPaid
    );

    try {
      await this.emailService.sendEnrollmentWelcomeEmail(
        updatedEnrollment.student.email,
        updatedEnrollment.student.name,
        updatedEnrollment.course.name,
        updatedEnrollment.course.instructor.name,
        updatedEnrollment.course.facebookGroupLink || '',
        updatedEnrollment.course.duration,
        updatedEnrollment.amountPaid
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error.message);
    }

    return updatedEnrollment;
  }

  async handleSslCommerzFailure(transactionData: any): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { transactionId: transactionData.tran_id }
    });

    if (enrollment) {
      await this.enrollmentRepository.update(enrollment.id, {
        paymentStatus: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureReason: transactionData.error || 'Payment failed',
        sslcommerzError: transactionData.error,
        sslcommerzResponse: transactionData
      });
    }
  }

  async handleSslCommerzIpn(body: any): Promise<{ status: string; message?: string }> {
    try {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { transactionId: body.tran_id }
      });

      if (!enrollment) {
        return { status: 'error', message: 'Enrollment not found' };
      }

      // Verify payment status from SSL Commerz
      if (body.status === 'VALID') {
        await this.enrollmentRepository.update(enrollment.id, {
          paymentStatus: PaymentStatus.SUCCESS,
          status: EnrollmentStatus.ACTIVE,
          enrolledAt: new Date(),
          paidAt: new Date(),
          sslcommerzTranId: body.tran_id,
          sslcommerzValId: body.val_id,
          sslcommerzBankTranId: body.bank_tran_id,
          sslcommerzCardType: body.card_type,
          sslcommerzCardIssuer: body.card_issuer,
          sslcommerzCardBrand: body.card_brand,
          sslcommerzResponse: body
        });
      } else {
        await this.enrollmentRepository.update(enrollment.id, {
          paymentStatus: PaymentStatus.FAILED,
          failedAt: new Date(),
          failureReason: body.error || 'Payment failed',
          sslcommerzError: body.error,
          sslcommerzResponse: body
        });
      }

      return { status: 'success' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll(): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      relations: ['student', 'course', 'course.instructor', 'course.modules', 'course.modules.assignments', 'course.modules.lessons'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['student', 'course', 'course.instructor', 'course.modules', 'course.modules.assignments', 'course.modules.lessons']
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  async findByStudent(studentId: number): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { student: { id: studentId } },
      relations: ['course', 'course.instructor', 'course.modules', 'course.modules.assignments', 'course.modules.lessons'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByCourse(courseId: number): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { course: { id: courseId } },
      relations: ['student', 'course.instructor', 'course.modules', 'course.modules.assignments', 'course.modules.lessons'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.findOne(id);
    Object.assign(enrollment, updateEnrollmentDto);
    return await this.enrollmentRepository.save(enrollment);
  }

  async remove(id: number): Promise<void> {
    const enrollment = await this.findOne(id);
    await this.enrollmentRepository.remove(enrollment);
  }

  async updateProgress(enrollmentId: number, progress: number): Promise<Enrollment> {
    const enrollment = await this.findOne(enrollmentId);
    const previousProgress = enrollment.progress;
    enrollment.progress = Math.min(100, Math.max(0, progress));

    // Check if course is completed
    if (enrollment.progress >= 100 && enrollment.status !== EnrollmentStatus.COMPLETED) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();

      // Send completion notification
      await this.notificationService.createCourseCompletedNotification(
        enrollment.student.id,
        enrollment.course.name
      );

      // Automatically generate certificate when course is completed
      try {
        await this.certificateService.generateCertificateForCompletedCourse(enrollmentId);

        // Send certificate generation notification
        await this.notificationService.createCertificateGeneratedNotification(
          enrollment.student.id,
          enrollment.course.name
        );
      } catch (error) {
        // Log error but don't fail the progress update
        console.error('Failed to generate certificate automatically:', error.message);
      }
    }

    return await this.enrollmentRepository.save(enrollment);
  }

  async getCourseLeaderboard(courseId: number): Promise<any[]> {
    // Get all enrollments for the course
    const enrollments = await this.enrollmentRepository.find({
      where: { course: { id: courseId } },
      relations: ['student'],
    });

    // Calculate average assignment marks for each student
    const leaderboardData = await Promise.all(
      enrollments.map(async (enrollment) => {
        const submissions = await this.assignmentSubmissionRepository
          .createQueryBuilder('submission')
          .leftJoin('submission.assignment', 'assignment')
          .leftJoin('assignment.module', 'module')
          .leftJoin('module.course', 'course')
          .where('submission.student.id = :studentId', { studentId: enrollment.student.id })
          .andWhere('course.id = :courseId', { courseId })
          .andWhere('submission.marks IS NOT NULL')
          .getMany();

        const totalMarks = submissions.reduce((sum, sub) => sum + (sub.marks || 0), 0);
        const averageMarks = submissions.length > 0 ? totalMarks / submissions.length : 0;
        const assignmentCount = submissions.length;

        return {
          studentId: enrollment.student.id,
          studentName: enrollment.student.name,
          averageMarks: Math.round(averageMarks * 100) / 100, // Round to 2 decimal places
          assignmentCount,
          totalMarks,
          progress: enrollment.progress,
          enrolledAt: enrollment.enrolledAt,
          completedAt: enrollment.completedAt,
          status: enrollment.status
        };
      })
    );

    // Sort by average marks (descending) and then by assignment count (descending)
    leaderboardData.sort((a, b) => {
      if (b.averageMarks !== a.averageMarks) {
        return b.averageMarks - a.averageMarks;
      }
      return b.assignmentCount - a.assignmentCount;
    });

    // Add rank
    return leaderboardData.map((data, index) => ({
      rank: index + 1,
      ...data
    }));
  }

  async getAssignmentMarksData(courseId: number): Promise<any> {
    // Get all assignments for the course
    const submissions = await this.assignmentSubmissionRepository
      .createQueryBuilder('submission')
      .leftJoin('submission.assignment', 'assignment')
      .leftJoin('assignment.module', 'module')
      .leftJoin('module.course', 'course')
      .leftJoin('submission.student', 'student')
      .where('course.id = :courseId', { courseId })
      .andWhere('submission.marks IS NOT NULL')
      .select([
        'submission.marks',
        'assignment.title',
        'assignment.totalMarks',
        'student.name',
        'student.id',
        'assignment.id'
      ])
      .getRawMany();

    // Group by assignment
    const assignmentData = submissions.reduce((acc, submission) => {
      const assignmentId = submission.assignment_id;
      const assignmentTitle = submission.assignment_title;
      const totalMarks = submission.assignment_totalMarks;

      if (!acc[assignmentId]) {
        acc[assignmentId] = {
          assignmentId,
          assignmentTitle,
          totalMarks,
          submissions: [],
          averageMarks: 0,
          highestMarks: 0,
          lowestMarks: 0,
          submissionCount: 0
        };
      }

      acc[assignmentId].submissions.push({
        studentId: submission.student_id,
        studentName: submission.student_name,
        marks: submission.submission_marks,
        percentage: Math.round((submission.submission_marks / totalMarks) * 100)
      });

      return acc;
    }, {});

    // Calculate statistics for each assignment
    Object.values(assignmentData).forEach((assignment: any) => {
      const marks = assignment.submissions.map(s => s.marks);
      assignment.averageMarks = Math.round(marks.reduce((sum, mark) => sum + mark, 0) / marks.length);
      assignment.highestMarks = Math.max(...marks);
      assignment.lowestMarks = Math.min(...marks);
      assignment.submissionCount = marks.length;
    });

    // Get student performance data
    const studentData = submissions.reduce((acc, submission) => {
      const studentId = submission.student_id;
      const studentName = submission.student_name;

      if (!acc[studentId]) {
        acc[studentId] = {
          studentId,
          studentName,
          assignments: [],
          totalMarks: 0,
          averageMarks: 0,
          assignmentCount: 0
        };
      }

      acc[studentId].assignments.push({
        assignmentId: submission.assignment_id,
        assignmentTitle: submission.assignment_title,
        marks: submission.submission_marks,
        totalMarks: submission.assignment_totalMarks,
        percentage: Math.round((submission.submission_marks / submission.assignment_totalMarks) * 100)
      });

      acc[studentId].totalMarks += submission.submission_marks;
      acc[studentId].assignmentCount += 1;

      return acc;
    }, {});

    // Calculate average marks for each student
    Object.values(studentData).forEach((student: any) => {
      student.averageMarks = Math.round(student.totalMarks / student.assignmentCount);
    });

    return {
      courseId,
      assignmentData: Object.values(assignmentData),
      studentData: Object.values(studentData),
      summary: {
        totalAssignments: Object.keys(assignmentData).length,
        totalStudents: Object.keys(studentData).length,
        totalSubmissions: submissions.length,
        overallAverageMarks: Math.round(
          submissions.reduce((sum, s) => sum + s.submission_marks, 0) / submissions.length
        )
      }
    };
  }

  async getStudentAssignmentMarksData(studentId: number, courseId: number): Promise<any> {
    const submissions = await this.assignmentSubmissionRepository
      .createQueryBuilder('submission')
      .leftJoin('submission.assignment', 'assignment')
      .leftJoin('assignment.module', 'module')
      .leftJoin('module.course', 'course')
      .where('submission.student.id = :studentId', { studentId })
      .andWhere('course.id = :courseId', { courseId })
      .andWhere('submission.marks IS NOT NULL')
      .select([
        'submission.marks',
        'submission.createdAt',
        'assignment.title',
        'assignment.totalMarks',
        'assignment.id'
      ])
      .orderBy('submission.createdAt', 'ASC')
      .getRawMany();

    const assignmentMarks = submissions.map(submission => ({
      assignmentId: submission.assignment_id,
      assignmentTitle: submission.assignment_title,
      marks: submission.submission_marks,
      totalMarks: submission.assignment_totalMarks,
      percentage: Math.round((submission.submission_marks / submission.assignment_totalMarks) * 100),
      submittedAt: submission.submission_createdAt
    }));

    const totalMarks = submissions.reduce((sum, s) => sum + s.submission_marks, 0);
    const averageMarks = submissions.length > 0 ? Math.round(totalMarks / submissions.length) : 0;
    const averagePercentage = submissions.length > 0
      ? Math.round(submissions.reduce((sum, s) => sum + (s.submission_marks / s.assignment_totalMarks) * 100, 0) / submissions.length)
      : 0;

    return {
      studentId,
      courseId,
      assignmentMarks,
      summary: {
        totalAssignments: submissions.length,
        totalMarks,
        averageMarks,
        averagePercentage,
        highestMarks: submissions.length > 0 ? Math.max(...submissions.map(s => s.submission_marks)) : 0,
        lowestMarks: submissions.length > 0 ? Math.min(...submissions.map(s => s.submission_marks)) : 0
      }
    };
  }

  async getStudentPerformance(studentId: number): Promise<any> {
    const enrollments = await this.findByStudent(studentId);

    const totalEnrollments = enrollments.length;
    const completedCourses = enrollments.filter(e => e.status === EnrollmentStatus.COMPLETED).length;
    const activeCourses = enrollments.filter(e => e.status === EnrollmentStatus.ACTIVE).length;
    const averageProgress = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
      : 0;

    const totalSpent = enrollments.reduce((sum, e) => sum + parseFloat(e.amountPaid.toString()), 0);

    return {
      totalEnrollments,
      completedCourses,
      activeCourses,
      averageProgress: Math.round(averageProgress),
      totalSpent,
      enrollments: enrollments.map(e => ({
        id: e.id,
        courseName: e.course.name,
        progress: e.progress,
        status: e.status,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        amountPaid: e.amountPaid
      }))
    };
  }

  async getEnrollmentStatistics(): Promise<any> {
    const totalEnrollments = await this.enrollmentRepository.count();
    const activeEnrollments = await this.enrollmentRepository.count({
      where: { status: EnrollmentStatus.ACTIVE }
    });
    const completedEnrollments = await this.enrollmentRepository.count({
      where: { status: EnrollmentStatus.COMPLETED }
    });
    const pendingEnrollments = await this.enrollmentRepository.count({
      where: { status: EnrollmentStatus.PENDING }
    });

    const totalRevenue = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('SUM(enrollment.amountPaid)', 'total')
      .getRawOne();

    const averageProgress = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('AVG(enrollment.progress)', 'average')
      .getRawOne();

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      pendingEnrollments,
      totalRevenue: totalRevenue?.total || 0,
      averageProgress: Math.round(averageProgress?.average || 0),
      completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0
    };
  }

  async getDynamicMotivationalMessage(studentId: number): Promise<string> {
    const performance = await this.getStudentPerformance(studentId);

    if (performance.completedCourses === 0) {
      return "🚀 Welcome to your learning journey! Every expert was once a beginner. Start with your first lesson and take it one step at a time.";
    }

    if (performance.averageProgress < 30) {
      return "💪 You're just getting started! Remember, consistency beats perfection. Keep going, and you'll see amazing results.";
    }

    if (performance.averageProgress < 60) {
      return "🔥 You're making great progress! You're halfway there. Keep pushing forward, and you'll reach your goals.";
    }

    if (performance.averageProgress < 90) {
      return "⭐ You're almost there! You've come so far. Just a little more effort and you'll complete this course successfully.";
    }

    if (performance.completedCourses >= 3) {
      return "🏆 You're a learning champion! You've completed multiple courses. Your dedication and hard work are truly inspiring.";
    }

    return "🎉 Congratulations on your progress! You're doing an amazing job. Keep up the excellent work!";
  }
}
