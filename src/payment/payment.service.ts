import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { NotificationService } from '../notification/notification.service';
import { CourseService } from '../course/course.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private notificationService: NotificationService,
    private courseService: CourseService,
    private userService: UsersService,
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return await this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['user', 'course'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'course']
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async findByUser(userId: number): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByCourse(courseId: number): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { course: { id: courseId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return await this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  // SSLCommerz Integration Methods
  async initiatePayment(userId: number, courseId: number): Promise<any> {
    const user = await this.userService.findOne(userId);
    const course = await this.courseService.findOne(courseId);

    const amount = course.discountPrice || course.price;
    const transactionId = `TXN_${Date.now()}_${userId}_${courseId}`;

    // Create payment record
    const payment = this.paymentRepository.create({
      amount,
      transactionId,
      status: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.SSLCOMMERZ,
      user: { id: userId },
      course: { id: courseId }
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // SSLCommerz payment initiation
    const sslcommerzData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: amount,
      currency: 'BDT',
      tran_id: transactionId,
      product_category: 'education',
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: user.address || 'N/A',
      cus_phone: user.phone,
      ship_name: user.name,
      ship_add1: user.address || 'N/A',
      ship_city: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      fail_url: `${process.env.FRONTEND_URL}/payment/fail`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/payment/ipn`,
      multi_card_name: '',
      value_a: userId.toString(),
      value_b: courseId.toString(),
      value_c: savedPayment.id.toString(),
      value_d: course.name,
    };

    return {
      payment: savedPayment,
      sslcommerzData,
      gatewayUrl: process.env.SSLCOMMERZ_GATEWAY_URL || 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
    };
  }

  async handlePaymentSuccess(sslcommerzResponse: any): Promise<Payment> {
    const payment = await this.findOne(parseInt(sslcommerzResponse.value_c));

    payment.status = PaymentStatus.SUCCESS;
    payment.sslcommerzSessionKey = sslcommerzResponse.sessionkey;
    payment.sslcommerzTranId = sslcommerzResponse.tran_id;
    payment.sslcommerzValId = sslcommerzResponse.val_id;
    payment.sslcommerzBankTranId = sslcommerzResponse.bank_tran_id;
    payment.sslcommerzCardType = sslcommerzResponse.card_type;
    payment.sslcommerzCardIssuer = sslcommerzResponse.card_issuer;
    payment.sslcommerzCardBrand = sslcommerzResponse.card_brand;
    payment.sslcommerzResponse = sslcommerzResponse;
    payment.paidAt = new Date();

    const updatedPayment = await this.paymentRepository.save(payment);

    // Send success notification
    await this.notificationService.createPaymentSuccessNotification(
      payment.user.id,
      payment.course.name,
      payment.amount,
      payment.transactionId
    );

    return updatedPayment;
  }

  async handlePaymentFailure(sslcommerzResponse: any): Promise<Payment> {
    const payment = await this.findOne(parseInt(sslcommerzResponse.value_c));

    payment.status = PaymentStatus.FAILED;
    payment.sslcommerzError = sslcommerzResponse.error;
    payment.sslcommerzResponse = sslcommerzResponse;
    payment.failureReason = sslcommerzResponse.error || 'Payment failed';
    payment.failedAt = new Date();

    const updatedPayment = await this.paymentRepository.save(payment);

    // Send failure notification
    await this.notificationService.createPaymentFailedNotification(
      payment.user.id,
      payment.course.name,
      payment.amount,
      payment.failureReason
    );

    return updatedPayment;
  }

  async getPaymentStatistics(): Promise<any> {
    const totalPayments = await this.paymentRepository.count();
    const successfulPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.SUCCESS }
    });
    const failedPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.FAILED }
    });
    const pendingPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.PENDING }
    });

    const totalAmount = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: PaymentStatus.SUCCESS })
      .getRawOne();

    return {
      totalPayments,
      successfulPayments,
      failedPayments,
      pendingPayments,
      totalAmount: totalAmount?.total || 0,
      successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0
    };
  }

  async getUserPaymentHistory(userId: number): Promise<any> {
    const payments = await this.findByUser(userId);

    const totalSpent = payments
      .filter(p => p.status === PaymentStatus.SUCCESS)
      .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

    const successfulPayments = payments.filter(p => p.status === PaymentStatus.SUCCESS);
    const failedPayments = payments.filter(p => p.status === PaymentStatus.FAILED);

    return {
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      failedPayments: failedPayments.length,
      totalSpent,
      payments: payments.map(p => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        transactionId: p.transactionId,
        courseName: p.course?.name,
        paidAt: p.paidAt,
        createdAt: p.createdAt
      }))
    };
  }
}
