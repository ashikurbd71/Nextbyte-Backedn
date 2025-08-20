import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { AdminJwtAuthGuard } from '../admin/admin-jwt-auth.guard';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) { }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificateService.create(createCertificateDto);
  }

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  findAll() {
    return this.certificateService.findAll();
  }

  @Get('stats')
  @UseGuards(AdminJwtAuthGuard)
  getStats() {
    return this.certificateService.getCertificateStats();
  }

  @Get('my-certificates')
  @UseGuards(JwtAuthGuard)
  getMyCertificates(
    @Request() req,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: 'issuedDate' | 'courseName' | 'completionPercentage',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const userId = req.user.id;
    const options = {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy,
      sortOrder,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    };
    return this.certificateService.findByStudent(userId, options);
  }

  @Get('my-certificates/stats')
  @UseGuards(JwtAuthGuard)
  getMyCertificateStats(@Request() req) {
    const userId = req.user.id;
    return this.certificateService.getUserCertificateStats(userId);
  }

  @Get('student/:studentId')
  @UseGuards(JwtAuthGuard)
  findByStudent(
    @Param('studentId') studentId: string,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: 'issuedDate' | 'courseName' | 'completionPercentage',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy,
      sortOrder,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    };
    return this.certificateService.findByStudent(+studentId, options);
  }

  @Get('user/:userId/certificates')
  @UseGuards(JwtAuthGuard)
  getUserCertificates(
    @Param('userId') userId: string,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: 'issuedDate' | 'courseName' | 'completionPercentage',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy,
      sortOrder,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    };
    return this.certificateService.findByStudent(+userId, options);
  }

  @Get('user/:userId/certificates/stats')
  @UseGuards(JwtAuthGuard)
  getUserCertificateStats(@Param('userId') userId: string) {
    return this.certificateService.getUserCertificateStats(+userId);
  }

  @Get('course/:courseId')
  @UseGuards(AdminJwtAuthGuard)
  findByCourse(@Param('courseId') courseId: string) {
    return this.certificateService.findByCourse(+courseId);
  }

  @Get('verify/:certificateNumber')
  verifyCertificate(@Param('certificateNumber') certificateNumber: string) {
    return this.certificateService.verifyCertificate(certificateNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.certificateService.findOne(+id);
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  generateCertificate(@Body() generateCertificateDto: GenerateCertificateDto) {
    return this.certificateService.generateCertificate(generateCertificateDto);
  }

  @Post('generate/:enrollmentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  generateCertificateForCompletedCourse(@Param('enrollmentId') enrollmentId: string) {
    return this.certificateService.generateCertificateForCompletedCourse(+enrollmentId);
  }

  @Patch(':id')
  @UseGuards(AdminJwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCertificateDto: UpdateCertificateDto) {
    return this.certificateService.update(+id, updateCertificateDto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.certificateService.remove(+id);
  }
}
