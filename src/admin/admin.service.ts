import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin, JobType, AdminRole } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { EmailService } from './email.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    // Check if admin with email already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: createAdminDto.email }
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Create admin
    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);

    // Send welcome email with credentials
    try {
      await this.emailService.sendAdminWelcomeEmail(
        createAdminDto.email,
        createAdminDto.name,
        createAdminDto.email,
        createAdminDto.password, // Send original password, not hashed
        createAdminDto.role || 'ADMIN'
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error, continue with admin creation
    }

    // Return admin without password
    const { password, ...adminWithoutPassword } = savedAdmin;
    return adminWithoutPassword as AdminResponseDto;
  }

  async login(loginAdminDto: LoginAdminDto): Promise<{ admin: AdminResponseDto; token: string }> {
    const admin = await this.adminRepository.findOne({
      where: { email: loginAdminDto.email }
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(loginAdminDto.password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role
    };

    const token = this.jwtService.sign(payload);

    // Return admin without password
    const { password, ...adminWithoutPassword } = admin;

    return {
      admin: adminWithoutPassword as AdminResponseDto,
      token
    };
  }

  async findAll(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepository.find({
      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
    });

    return admins as AdminResponseDto[];
  }

  async findOne(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin as AdminResponseDto;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // If email is being updated, check for conflicts
    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const existingAdmin = await this.adminRepository.findOne({
        where: { email: updateAdminDto.email }
      });

      if (existingAdmin) {
        throw new ConflictException('Admin with this email already exists');
      }
    }

    // Hash password if it's being updated
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    await this.adminRepository.update(id, updateAdminDto);

    const updatedAdmin = await this.adminRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
    });

    return updatedAdmin as AdminResponseDto;
  }

  async remove(id: number): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    await this.adminRepository.remove(admin);
  }

  async deactivate(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    admin.isActive = false;
    await this.adminRepository.save(admin);

    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword as AdminResponseDto;
  }

  async activate(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    admin.isActive = true;
    await this.adminRepository.save(admin);

    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword as AdminResponseDto;
  }

  async findByRole(role: AdminRole): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepository.find({
      where: { role },
      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
    });

    return admins as AdminResponseDto[];
  }

  async findByJobType(jobType: JobType): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepository.find({
      where: { jobType },
      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']
    });

    return admins as AdminResponseDto[];
  }
}

  async findOne(id: number): Promise<AdminResponseDto> {

    const admin = await this.adminRepository.findOne({

      where: { id },

      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']

    });



    if (!admin) {

      throw new NotFoundException('Admin not found');

    }



    return admin as AdminResponseDto;

  }



  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {

    const admin = await this.adminRepository.findOne({ where: { id } });



    if (!admin) {

      throw new NotFoundException('Admin not found');

    }



    // If email is being updated, check for conflicts

    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {

      const existingAdmin = await this.adminRepository.findOne({

        where: { email: updateAdminDto.email }

      });



      if (existingAdmin) {

        throw new ConflictException('Admin with this email already exists');

      }

    }



    // Hash password if it's being updated

    if (updateAdminDto.password) {

      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);

    }



    await this.adminRepository.update(id, updateAdminDto);



    const updatedAdmin = await this.adminRepository.findOne({

      where: { id },

      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']

    });



    return updatedAdmin as AdminResponseDto;

  }



  async remove(id: number): Promise<void> {

    const admin = await this.adminRepository.findOne({ where: { id } });



    if (!admin) {

      throw new NotFoundException('Admin not found');

    }



    await this.adminRepository.remove(admin);

  }



  async deactivate(id: number): Promise<AdminResponseDto> {

    const admin = await this.adminRepository.findOne({ where: { id } });



    if (!admin) {

      throw new NotFoundException('Admin not found');

    }



    admin.isActive = false;

    await this.adminRepository.save(admin);



    const { password, ...adminWithoutPassword } = admin;

    return adminWithoutPassword as AdminResponseDto;

  }



  async activate(id: number): Promise<AdminResponseDto> {

    const admin = await this.adminRepository.findOne({ where: { id } });



    if (!admin) {

      throw new NotFoundException('Admin not found');

    }



    admin.isActive = true;

    await this.adminRepository.save(admin);



    const { password, ...adminWithoutPassword } = admin;

    return adminWithoutPassword as AdminResponseDto;

  }



  async findByRole(role: AdminRole): Promise<AdminResponseDto[]> {

    const admins = await this.adminRepository.find({

      where: { role },

      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']

    });



    return admins as AdminResponseDto[];

  }



  async findByJobType(jobType: JobType): Promise<AdminResponseDto[]> {

    const admins = await this.adminRepository.find({

      where: { jobType },

      select: ['id', 'name', 'email', 'bio', 'designation', 'experience', 'fbLink', 'linkedinLink', 'instaLink', 'expertise', 'salary', 'jobType', 'photoUrl', 'role', 'isActive', 'createdAt', 'updatedAt']

    });



    return admins as AdminResponseDto[];

  }

}


