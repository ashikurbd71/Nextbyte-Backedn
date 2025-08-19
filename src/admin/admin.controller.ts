import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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
  async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    return this.adminService.create(createAdminDto);
  }

  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto): Promise<{ admin: AdminResponseDto; token: string }> {
    return this.adminService.login(loginAdminDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async findAll(): Promise<AdminResponseDto[]> {
    return this.adminService.findAll();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminService.findOne(+id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
    return this.adminService.update(+id, updateAdminDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.adminService.remove(+id);
    return { message: 'Admin deleted successfully' };
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch('/deactivate/:id')
  async deactivate(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminService.deactivate(+id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch('/activate/:id')
  async activate(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminService.activate(+id);
  }

}
