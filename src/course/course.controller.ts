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
  ParseIntPipe,

} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { AdminJwtAuthGuard } from '../admin/admin-jwt-auth.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  // @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get('statistics')
  // @UseGuards(AdminJwtAuthGuard)
  async getCourseStatistics() {
    return await this.courseService.getCourseStatistics();
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return await this.courseService.findByCategory(categoryId);
  }

  @Get('instructor/:instructorId')
  async findByInstructor(@Param('instructorId', ParseIntPipe) instructorId: number) {
    return await this.courseService.findByInstructor(instructorId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(AdminJwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Post(':id/enroll/:studentId')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async enrollStudent(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('studentId', ParseIntPipe) studentId: number
  ) {
    return await this.courseService.enrollStudent(courseId, studentId);
  }

  @Delete(':id')
  // @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.courseService.remove(id);
  }
}
