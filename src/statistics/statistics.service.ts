import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../enrollment/entities/enrollment.entity';
import { Enrollment, EnrollmentStatus } from '../enrollment/entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Course } from '../course/entities/course.entity';
import { Review } from '../review/entities/review.entity';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Enrollment)
        private enrollmentRepository: Repository<Enrollment>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) { }

    async getDashboardStatistics() {
        const [
            totalEarningsYear,
            totalEarningsMonth,
            totalEarningsToday,
            totalEarningsWeek,
            totalPendingEnrollments,
            totalCancelledPayments,
            totalUsers,
            totalInstructors,
            totalActiveCourses,
            totalStudents,
            totalCourses,
            averageRating,
            monthlyEarnings,
            weeklyEarnings,
            dailyEarnings,
            topCourses,
            recentEnrollments,
            paymentStatusStats,
            enrollmentStatusStats
        ] = await Promise.all([
            this.getTotalEarningsYear(),
            this.getTotalEarningsMonth(),
            this.getTotalEarningsToday(),
            this.getTotalEarningsWeek(),
            this.getTotalPendingEnrollments(),
            this.getTotalCancelledPayments(),
            this.getTotalUsers(),
            this.getTotalInstructors(),
            this.getTotalActiveCourses(),
            this.getTotalStudents(),
            this.getTotalCourses(),
            this.getAverageRating(),
            this.getMonthlyEarnings(),
            this.getWeeklyEarnings(),
            this.getDailyEarnings(),
            this.getTopCourses(),
            this.getRecentEnrollments(),
            this.getPaymentStatusStats(),
            this.getEnrollmentStatusStats()
        ]);

        return {
            earnings: {
                totalYear: totalEarningsYear,
                totalMonth: totalEarningsMonth,
                totalToday: totalEarningsToday,
                totalWeek: totalEarningsWeek,
                monthly: monthlyEarnings,
                weekly: weeklyEarnings,
                daily: dailyEarnings
            },
            enrollments: {
                totalPending: totalPendingEnrollments,
                statusStats: enrollmentStatusStats
            },
            payments: {
                totalCancelled: totalCancelledPayments,
                statusStats: paymentStatusStats
            },
            users: {
                total: totalUsers,
                totalStudents: totalStudents,
                totalInstructors: totalInstructors
            },
            courses: {
                total: totalCourses,
                totalActive: totalActiveCourses,
                averageRating: averageRating,
                topCourses: topCourses
            },
            recentActivity: {
                recentEnrollments: recentEnrollments
            }
        };
    }

    private async getTotalEarningsYear(): Promise<number> {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .where('enrollment.paymentStatus = :status', { status: PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfYear })
            .getRawOne();

        return parseFloat(result?.total || '0');
    }

    private async getTotalEarningsMonth(): Promise<number> {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .where('enrollment.paymentStatus = :status', { status: PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfMonth })
            .getRawOne();

        return parseFloat(result?.total || '0');
    }

    private async getTotalEarningsToday(): Promise<number> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .where('enrollment.paymentStatus = :status', { status: PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfDay })
            .getRawOne();

        return parseFloat(result?.total || '0');
    }

    private async getTotalEarningsWeek(): Promise<number> {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('SUM(enrollment.amountPaid)', 'total')
            .where('enrollment.paymentStatus = :status', { status: PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfWeek })
            .getRawOne();

        return parseFloat(result?.total || '0');
    }

    private async getTotalPendingEnrollments(): Promise<number> {
        return await this.enrollmentRepository.count({
            where: { status: EnrollmentStatus.PENDING }
        });
    }

    private async getTotalCancelledPayments(): Promise<number> {
        return await this.enrollmentRepository.count({
            where: { paymentStatus: PaymentStatus.CANCELLED }
        });
    }

    private async getTotalUsers(): Promise<number> {
        return await this.userRepository.count({
            where: { isActive: true, isBanned: false }
        });
    }

    private async getTotalInstructors(): Promise<number> {
        return await this.adminRepository.count({
            where: { isActive: true }
        });
    }

    private async getTotalActiveCourses(): Promise<number> {
        return await this.courseRepository.count({
            where: { isActive: true }
        });
    }

    private async getTotalStudents(): Promise<number> {
        return await this.userRepository.count({
            where: { isActive: true, isBanned: false }
        });
    }

    private async getTotalCourses(): Promise<number> {
        return await this.courseRepository.count();
    }

    private async getAverageRating(): Promise<number> {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .getRawOne();

        return Math.round((parseFloat(result?.average || '0')) * 10) / 10;
    }

    private async getMonthlyEarnings(): Promise<any[]> {
        const currentYear = new Date().getFullYear();
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select([
                'EXTRACT(MONTH FROM enrollment.paidAt) as month',
                'SUM(enrollment.amountPaid) as total'
            ])
            .where('enrollment.paymentStatus = :status', { status: PaymentStatus.SUCCESS })
            .andWhere('EXTRACT(YEAR FROM enrollment.paidAt) = :year', { year: currentYear })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return result.map(item => ({
            month: months[parseInt(item.month) - 1],
            total: parseFloat(item.total || '0')
        }));
    }

    private async getWeeklyEarnings(): Promise<any[]> {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select([
                'EXTRACT(WEEK FROM enrollment.paidAt) as week',
                'SUM(enrollment.amountPaid) as total'
            ])
            .where('enrollment.paymentStatus = :status', { status: PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfYear })
            .groupBy('week')
            .orderBy('week', 'ASC')
            .limit(12)
            .getRawMany();

        return result.map(item => ({
            week: `Week ${item.week}`,
            total: parseFloat(item.total || '0')
        }));
    }

    private async getDailyEarnings(): Promise<any[]> {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select([
                'DATE(enrollment.paidAt) as date',
                'SUM(enrollment.amountPaid) as total'
            ])
            .where('enrollment.paymentStatus = :status', { status: PaymentStatus.SUCCESS })
            .andWhere('enrollment.paidAt >= :startDate', { startDate: startOfMonth })
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();

        return result.map(item => ({
            date: item.date,
            total: parseFloat(item.total || '0')
        }));
    }

    private async getTopCourses(): Promise<any[]> {
        const result = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoin('course.enrollments', 'enrollment')
            .leftJoin('course.reviews', 'review')
            .select([
                'course.id as courseId',
                'course.name as courseName',
                'course.thumbnail as thumbnail',
                'COUNT(DISTINCT enrollment.id) as enrollmentCount',
                'AVG(review.rating) as averageRating',
                'COUNT(DISTINCT review.id) as reviewCount'
            ])
            .groupBy('course.id')
            .orderBy('enrollmentCount', 'DESC')
            .limit(5)
            .getRawMany();

        return result.map(item => ({
            courseId: item.courseId,
            courseName: item.courseName,
            thumbnail: item.thumbnail,
            enrollmentCount: parseInt(item.enrollmentCount),
            averageRating: Math.round((parseFloat(item.averageRating || '0')) * 10) / 10,
            reviewCount: parseInt(item.reviewCount)
        }));
    }

    private async getRecentEnrollments(): Promise<any[]> {
        return await this.enrollmentRepository.find({
            relations: ['student', 'course'],
            order: { createdAt: 'DESC' },
            take: 10
        });
    }

    private async getPaymentStatusStats(): Promise<any> {
        const [completed, pending, failed, cancelled] = await Promise.all([
            this.enrollmentRepository.count({ where: { paymentStatus: PaymentStatus.SUCCESS } }),
            this.enrollmentRepository.count({ where: { paymentStatus: PaymentStatus.PENDING } }),
            this.enrollmentRepository.count({ where: { paymentStatus: PaymentStatus.FAILED } }),
            this.enrollmentRepository.count({ where: { paymentStatus: PaymentStatus.CANCELLED } })
        ]);

        return {
            completed,
            pending,
            failed,
            cancelled,
            total: completed + pending + failed + cancelled
        };
    }

    private async getEnrollmentStatusStats(): Promise<any> {
        const [active, completed, pending, cancelled] = await Promise.all([
            this.enrollmentRepository.count({ where: { status: EnrollmentStatus.ACTIVE } }),
            this.enrollmentRepository.count({ where: { status: EnrollmentStatus.COMPLETED } }),
            this.enrollmentRepository.count({ where: { status: EnrollmentStatus.PENDING } }),
            this.enrollmentRepository.count({ where: { status: EnrollmentStatus.CANCELLED } })
        ]);

        return {
            active,
            completed,
            pending,
            cancelled,
            total: active + completed + pending + cancelled
        };
    }

    async getEarningsReport(startDate: Date, endDate: Date) {
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .leftJoin('enrollment.course', 'course')
            .leftJoin('enrollment.student', 'student')
            .select([
                'enrollment.id as enrollmentId',
                'enrollment.amountPaid as amount',
                'enrollment.paymentStatus as status',
                'enrollment.paidAt as paidAt',
                'enrollment.paymentMethod as paymentMethod',
                'course.name as courseName',
                'student.name as studentName',
                'student.email as studentEmail'
            ])
            .where('enrollment.paidAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('enrollment.paymentStatus = :status', { status: PaymentStatus.SUCCESS })
            .orderBy('enrollment.paidAt', 'DESC')
            .getRawMany();

        const totalEarnings = result.reduce((sum, item) => sum + parseFloat(item.amount), 0);

        return {
            totalEarnings,
            totalPayments: result.length,
            payments: result,
            dateRange: {
                startDate,
                endDate
            }
        };
    }

    async getEnrollmentReport(startDate: Date, endDate: Date) {
        const result = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .leftJoin('enrollment.course', 'course')
            .leftJoin('enrollment.student', 'student')
            .select([
                'enrollment.id as enrollmentId',
                'enrollment.status as status',
                'enrollment.progress as progress',
                'enrollment.enrolledAt as enrolledAt',
                'enrollment.completedAt as completedAt',
                'course.name as courseName',
                'student.name as studentName',
                'student.email as studentEmail'
            ])
            .where('enrollment.enrolledAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('enrollment.enrolledAt', 'DESC')
            .getRawMany();

        const totalEnrollments = result.length;
        const completedEnrollments = result.filter(e => e.status === EnrollmentStatus.COMPLETED).length;
        const activeEnrollments = result.filter(e => e.status === EnrollmentStatus.ACTIVE).length;

        return {
            totalEnrollments,
            completedEnrollments,
            activeEnrollments,
            completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
            enrollments: result,
            dateRange: {
                startDate,
                endDate
            }
        };
    }
}
