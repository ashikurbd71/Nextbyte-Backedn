import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { Course } from '../course/entities/course.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { NotificationService } from '../notification/notification.service';
import { EnrollmentService } from '../enrollment/enrollment.service';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private notificationService: NotificationService,
    private enrollmentService: EnrollmentService,
  ) { }

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    // Load the course entity
    const course = await this.courseRepository.findOne({
      where: { id: createModuleDto.courseId }
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${createModuleDto.courseId} not found`);
    }

    // Create module object with proper relationships
    const { courseId, ...moduleData } = createModuleDto;
    const module = this.moduleRepository.create({
      ...moduleData,
      course,
    });

    const savedModule = await this.moduleRepository.save(module);

    // Send notification to enrolled students about new module
    const enrollments = await this.enrollmentService.findByCourse(course.id);
    for (const enrollment of enrollments) {
      await this.notificationService.createNewModuleUploadNotification(
        enrollment.student.id,
        savedModule.title,
        course.name
      );
    }

    return savedModule;
  }

  async findAll(): Promise<Module[]> {
    return await this.moduleRepository.find({
      relations: ['course', 'lessons', 'assignments'],
      order: { order: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Module> {
    const module = await this.moduleRepository.findOne({
      where: { id },
      relations: ['course', 'lessons', 'assignments']
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async findByCourse(courseId: number): Promise<Module[]> {
    return await this.moduleRepository.find({
      where: { course: { id: courseId } },
      relations: ['lessons', 'assignments', 'course'],
      order: { order: 'ASC' }
    });
  }

  async update(id: number, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const module = await this.findOne(id);

    // Handle course update if provided
    if (updateModuleDto.courseId) {
      const course = await this.courseRepository.findOne({
        where: { id: updateModuleDto.courseId }
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${updateModuleDto.courseId} not found`);
      }

      module.course = course;
    }

    // Remove the courseId field as it's not part of the Module entity
    const { courseId, ...updateData } = updateModuleDto;
    Object.assign(module, updateData);

    return await this.moduleRepository.save(module);
  }

  async remove(id: number): Promise<void> {
    const module = await this.findOne(id);
    await this.moduleRepository.remove(module);
  }

  async getModuleWithContent(moduleId: number): Promise<any> {
    const module = await this.findOne(moduleId);

    return {
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order,
      duration: module.duration,
      isActive: module.isActive,
      course: {
        id: module.course.id,
        name: module.course.name
      },
      lessons: module.lessons?.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        thumbnail: lesson.thumbnail,
        isPreview: lesson.isPreview,
        isActive: lesson.isActive
      })) || [],
      assignments: module.assignments?.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        githubLink: assignment.githubLink,
        liveLink: assignment.liveLink,
        totalMarks: assignment.totalMarks,
        dueDate: assignment.dueDate,
        isActive: assignment.isActive
      })) || []
    };
  }

  async getModuleStatistics(): Promise<any> {
    const totalModules = await this.moduleRepository.count();
    const activeModules = await this.moduleRepository.count({
      where: { isActive: true }
    });

    const modulesWithLessons = await this.moduleRepository
      .createQueryBuilder('module')
      .leftJoin('module.lessons', 'lesson')
      .select([
        'module.id as moduleId',
        'module.title as moduleTitle',
        'COUNT(lesson.id) as lessonCount'
      ])
      .groupBy('module.id')
      .getRawMany();

    const modulesWithAssignments = await this.moduleRepository
      .createQueryBuilder('module')
      .leftJoin('module.assignments', 'assignment')
      .select([
        'module.id as moduleId',
        'module.title as moduleTitle',
        'COUNT(assignment.id) as assignmentCount'
      ])
      .groupBy('module.id')
      .getRawMany();

    return {
      totalModules,
      activeModules,
      averageLessonsPerModule: modulesWithLessons.length > 0
        ? modulesWithLessons.reduce((sum, m) => sum + parseInt(m.lessonCount), 0) / modulesWithLessons.length
        : 0,
      averageAssignmentsPerModule: modulesWithAssignments.length > 0
        ? modulesWithAssignments.reduce((sum, m) => sum + parseInt(m.assignmentCount), 0) / modulesWithAssignments.length
        : 0,
      modulesWithContent: modulesWithLessons.map(m => ({
        moduleId: m.moduleId,
        moduleTitle: m.moduleTitle,
        lessonCount: parseInt(m.lessonCount)
      }))
    };
  }
}
