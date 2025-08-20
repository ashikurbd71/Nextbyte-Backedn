import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({
      relations: ['category', 'instructor', 'students'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['category', 'instructor', 'students', 'modules', 'reviews']
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }

  async findByCategory(categoryId: number): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'instructor'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByInstructor(instructorId: number): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { instructor: { id: instructorId } },
      relations: ['category', 'students'],
      order: { createdAt: 'DESC' }
    });
  }

  async enrollStudent(courseId: number, studentId: number): Promise<Course> {
    const course = await this.findOne(courseId);
    course.students = course.students || [];
    course.students.push({ id: studentId } as any);
    course.totalJoin += 1;
    return await this.courseRepository.save(course);
  }

  async getCourseStatistics(): Promise<any> {
    const totalCourses = await this.courseRepository.count();
    const publishedCourses = await this.courseRepository.count({
      where: { isPublished: true }
    });
    const activeCourses = await this.courseRepository.count({
      where: { isActive: true }
    });

    const totalEnrollments = await this.courseRepository
      .createQueryBuilder('course')
      .select('SUM(course.totalJoin)', 'total')
      .getRawOne();

    return {
      totalCourses,
      publishedCourses,
      activeCourses,
      totalEnrollments: totalEnrollments?.total || 0,
      averageEnrollments: totalCourses > 0 ? (totalEnrollments?.total || 0) / totalCourses : 0
    };
  }
}
