import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('my')
  findMyPayments(@Request() req) {
    return this.paymentService.findByUser(req.user.id);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.paymentService.findByCourse(courseId);
  }

  @Get('statistics')
  getPaymentStatistics() {
    return this.paymentService.getPaymentStatistics();
  }

  @Get('my-history')
  getMyPaymentHistory(@Request() req) {
    return this.paymentService.getUserPaymentHistory(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }

  // SSLCommerz Integration Endpoints
  @Post('initiate/:courseId')
  initiatePayment(@Param('courseId', ParseIntPipe) courseId: number, @Request() req) {
    return this.paymentService.initiatePayment(req.user.id, courseId);
  }

  @Post('success')
  handlePaymentSuccess(@Body() sslcommerzResponse: any) {
    return this.paymentService.handlePaymentSuccess(sslcommerzResponse);
  }

  @Post('fail')
  handlePaymentFailure(@Body() sslcommerzResponse: any) {
    return this.paymentService.handlePaymentFailure(sslcommerzResponse);
  }

  @Post('ipn')
  handleIPN(@Body() sslcommerzResponse: any) {
    // IPN (Instant Payment Notification) handler
    if (sslcommerzResponse.status === 'VALID') {
      return this.paymentService.handlePaymentSuccess(sslcommerzResponse);
    } else {
      return this.paymentService.handlePaymentFailure(sslcommerzResponse);
    }
  }
}
