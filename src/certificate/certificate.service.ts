import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) { }

  async create(createCertificateDto: CreateCertificateDto): Promise<Certificate> {
    const certificate = this.certificateRepository.create({
      ...createCertificateDto,
      certificateNumber: this.generateCertificateNumber(),
      issuedDate: new Date(),
    });

    return await this.certificateRepository.save(certificate);
  }

  async findAll(): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      relations: ['student', 'course', 'enrollment'],
    });
  }

  async findOne(id: number): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['student', 'course', 'enrollment'],
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return certificate;
  }

  async findByStudent(studentId: number, options?: {
    isActive?: boolean;
    sortBy?: 'issuedDate' | 'courseName' | 'completionPercentage';
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }): Promise<Certificate[]> {
    const queryBuilder = this.certificateRepository
      .createQueryBuilder('certificate')
      .leftJoinAndSelect('certificate.student', 'student')
      .leftJoinAndSelect('certificate.course', 'course')
      .leftJoinAndSelect('certificate.enrollment', 'enrollment')
      .where('certificate.student.id = :studentId', { studentId });

    // Apply filters
    if (options?.isActive !== undefined) {
      queryBuilder.andWhere('certificate.isActive = :isActive', { isActive: options.isActive });
    }

    // Apply sorting
    if (options?.sortBy) {
      const sortOrder = options.sortOrder || 'DESC';
      switch (options.sortBy) {
        case 'issuedDate':
          queryBuilder.orderBy('certificate.issuedDate', sortOrder);
          break;
        case 'courseName':
          queryBuilder.orderBy('certificate.courseName', sortOrder);
          break;
        case 'completionPercentage':
          queryBuilder.orderBy('certificate.completionPercentage', sortOrder);
          break;
        default:
          queryBuilder.orderBy('certificate.issuedDate', 'DESC');
      }
    } else {
      queryBuilder.orderBy('certificate.issuedDate', 'DESC');
    }

    // Apply pagination
    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }
    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    return await queryBuilder.getMany();
  }

  async findByCourse(courseId: number): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { course: { id: courseId } },
      relations: ['student', 'course', 'enrollment'],
    });
  }

  async update(id: number, updateCertificateDto: UpdateCertificateDto): Promise<Certificate> {
    const certificate = await this.findOne(id);

    Object.assign(certificate, updateCertificateDto);

    return await this.certificateRepository.save(certificate);
  }

  async remove(id: number): Promise<void> {
    const certificate = await this.findOne(id);
    await this.certificateRepository.remove(certificate);
  }

  async generateCertificate(generateCertificateDto: GenerateCertificateDto): Promise<Certificate> {
    const { enrollmentId, certificateUrl, certificatePdfUrl } = generateCertificateDto;

    // Find the enrollment with related data
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
      relations: ['student', 'course'],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${enrollmentId} not found`);
    }

    // Check if course is completed (progress >= 100%)
    if (enrollment.progress < 100) {
      throw new BadRequestException('Course must be 100% completed to generate certificate');
    }

    // Check if certificate already exists for this enrollment
    const existingCertificate = await this.certificateRepository.findOne({
      where: { enrollment: { id: enrollmentId } },
    });

    if (existingCertificate) {
      throw new BadRequestException('Certificate already exists for this enrollment');
    }

    // Create the certificate
    const certificate = this.certificateRepository.create({
      certificateNumber: this.generateCertificateNumber(),
      studentName: enrollment.student.name || 'Unknown Student',
      courseName: enrollment.course.name,
      completionPercentage: enrollment.progress,
      issuedDate: new Date(),
      certificateUrl,
      certificatePdfUrl,
      student: enrollment.student,
      course: enrollment.course,
      enrollment: enrollment,
    });

    return await this.certificateRepository.save(certificate);
  }

  async generateCertificateForCompletedCourse(enrollmentId: number): Promise<Certificate> {
    return await this.generateCertificate({ enrollmentId });
  }

  async verifyCertificate(certificateNumber: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { certificateNumber },
      relations: ['student', 'course', 'enrollment'],
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with number ${certificateNumber} not found`);
    }

    if (!certificate.isActive) {
      throw new BadRequestException('Certificate is inactive');
    }

    if (certificate.expiryDate && new Date() > certificate.expiryDate) {
      throw new BadRequestException('Certificate has expired');
    }

    return certificate;
  }

  async getCertificateWithStudentId(certificateNumber: string): Promise<{
    certificate: Certificate;
    studentId: string;
    studentName: string;
    courseName: string;
    completionPercentage: number;
    issuedDate: Date;
    certificateNumber: string;
  }> {
    const certificate = await this.certificateRepository.findOne({
      where: { certificateNumber },
      relations: ['student', 'course', 'enrollment'],
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with number ${certificateNumber} not found`);
    }

    return {
      certificate,
      studentId: certificate.student.studentId || 'N/A',
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      completionPercentage: certificate.completionPercentage,
      issuedDate: certificate.issuedDate,
      certificateNumber: certificate.certificateNumber,
    };
  }

  async getUserCertificateStats(userId: number): Promise<{
    totalCertificates: number;
    activeCertificates: number;
    expiredCertificates: number;
    recentCertificates: number;
  }> {
    const totalCertificates = await this.certificateRepository.count({
      where: { student: { id: userId } },
    });

    const activeCertificates = await this.certificateRepository.count({
      where: {
        student: { id: userId },
        isActive: true
      },
    });

    const expiredCertificates = await this.certificateRepository.count({
      where: {
        student: { id: userId },
        isActive: true,
        expiryDate: new Date(),
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCertificates = await this.certificateRepository.count({
      where: {
        student: { id: userId },
        issuedDate: thirtyDaysAgo,
      },
    });

    return {
      totalCertificates,
      activeCertificates,
      expiredCertificates,
      recentCertificates,
    };
  }

  private generateCertificateNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CERT-${timestamp}-${random}`;
  }

  async getCertificateStats(): Promise<{
    totalCertificates: number;
    activeCertificates: number;
    expiredCertificates: number;
  }> {
    const totalCertificates = await this.certificateRepository.count();
    const activeCertificates = await this.certificateRepository.count({
      where: { isActive: true },
    });
    const expiredCertificates = await this.certificateRepository.count({
      where: {
        isActive: true,
        expiryDate: new Date(),
      },
    });

    return {
      totalCertificates,
      activeCertificates,
      expiredCertificates,
    };
  }
}
