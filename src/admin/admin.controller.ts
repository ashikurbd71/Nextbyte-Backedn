import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { AdminJwtAuthGuard } from './admin-jwt-auth.guard';
import { Admin, JobType, AdminRole } from './entities/admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAdminDto: CreateAdminDto): Promise<{ statusCode: number; message: string; data: AdminResponseDto }> {
    const admin = await this.adminService.create(createAdminDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Admin created successfully',
      data: admin
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginAdminDto: LoginAdminDto): Promise<{ statusCode: number; message: string; data: { admin: AdminResponseDto; token: string } }> {
    const result = await this.adminService.login(loginAdminDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result
    };
  }

  //  @UseGuards(AdminJwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<{ statusCode: number; message: string; data: AdminResponseDto[] }> {
    const admins = await this.adminService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Admins retrieved successfully',
      data: admins
    };
  }

  // @UseGuards(AdminJwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: AdminResponseDto }> {
    const admin = await this.adminService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Admin retrieved successfully',
      data: admin
    };
  }

  // @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<{ statusCode: number; message: string; data: AdminResponseDto }> {
    const admin = await this.adminService.update(+id, updateAdminDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Admin updated successfully',
      data: admin
    };
  }

  // @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.adminService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Admin deleted successfully'
    };
  }

  // @UseGuards(AdminJwtAuthGuard)
  @Patch('/deactivate/:id')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: AdminResponseDto }> {
    const admin = await this.adminService.deactivate(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Admin deactivated successfully',
      data: admin
    };
  }

  // @UseGuards(AdminJwtAuthGuard)
  @Patch('/activate/:id')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: AdminResponseDto }> {
    const admin = await this.adminService.activate(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Admin activated successfully',
      data: admin
    };
  }



}
