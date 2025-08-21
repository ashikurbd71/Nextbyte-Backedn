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
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { AdminJwtAuthGuard } from '../admin/admin-jwt-auth.guard';
import {
  CourseResponseDto,
  CourseListResponseDto,
  CourseSingleResponseDto,
  CourseErrorResponseDto
} from './dto/course-response.dto';

@ApiTags('courses')
@Controller('course')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
    type: CourseSingleResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: CourseErrorResponseDto
  })
  // @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto) {
    try {
      const course = await this.courseService.create(createCourseDto);
      return {
        success: true,
        message: 'Course created successfully',
        data: course
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: 200,
    description: 'List of courses retrieved successfully',
    type: CourseListResponseDto
  })
  async findAll() {
    try {
      const courses = await this.courseService.findAll();
      return {
        success: true,
        data: courses,
        count: courses.length
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get course statistics' })
  @ApiResponse({
    status: 200,
    description: 'Course statistics retrieved successfully'
  })
  // @UseGuards(AdminJwtAuthGuard)
  async getCourseStatistics() {
    try {
      const statistics = await this.courseService.getCourseStatistics();
      return {
        success: true,
        data: statistics
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get courses by category' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Courses by category retrieved successfully',
    type: CourseListResponseDto
  })
  async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    try {
      const courses = await this.courseService.findByCategory(categoryId);
      return {
        success: true,
        data: courses,
        count: courses.length
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }

  @Get('instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor' })
  @ApiParam({ name: 'instructorId', description: 'Instructor ID' })
  @ApiResponse({
    status: 200,
    description: 'Courses by instructor retrieved successfully',
    type: CourseListResponseDto
  })
  async findByInstructor(@Param('instructorId', ParseIntPipe) instructorId: number) {
    try {
      const courses = await this.courseService.findByInstructor(instructorId);
      return {
        success: true,
        data: courses,
        count: courses.length
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Course retrieved successfully',
    type: CourseSingleResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
    type: CourseErrorResponseDto
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const course = await this.courseService.findOne(id);
      return {
        success: true,
        data: course
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    type: CourseSingleResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
    type: CourseErrorResponseDto
  })
  // @UseGuards(AdminJwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    try {
      const course = await this.courseService.update(id, updateCourseDto);
      return {
        success: true,
        message: 'Course updated successfully',
        data: course
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }

  @Post(':id/enroll/:studentId')
  @ApiOperation({ summary: 'Enroll a student in a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student enrolled successfully',
    type: CourseSingleResponseDto
  })
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async enrollStudent(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('studentId', ParseIntPipe) studentId: number
  ) {
    try {
      const course = await this.courseService.enrollStudent(courseId, studentId);
      return {
        success: true,
        message: 'Student enrolled successfully',
        data: course
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: 204,
    description: 'Course deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
    type: CourseErrorResponseDto
  })
  // @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.courseService.remove(id);
      return {
        success: true,
        message: 'Course deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response || error.message
      };
    }
  }
}
