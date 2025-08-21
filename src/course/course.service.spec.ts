import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { Category } from '../categoris/entities/categoris.entity';
import { Admin } from '../admin/entities/admin.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CourseService', () => {
  let service: CourseService;
  let courseRepository: Repository<Course>;
  let categoryRepository: Repository<Category>;
  let adminRepository: Repository<Admin>;

  const mockCourseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCategoryRepository = {
    findOne: jest.fn(),
  };

  const mockAdminRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    courseRepository = module.get<Repository<Course>>(getRepositoryToken(Course));
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCourseDto: CreateCourseDto = {
      name: 'Test Course',
      slugName: 'test-course',
      duration: '10 hours',
      price: 99.99,
      whatYouWillLearn: ['Learn to code', 'Build projects'],
      technologies: [{ name: 'JavaScript', image: 'js.png' }],
      requirements: ['Basic programming knowledge'],
      categoryId: 1,
      instructorId: 1,
    };

    const mockCategory = { id: 1, name: 'Programming' };
    const mockInstructor = { id: 1, name: 'John Doe' };
    const mockCourse = { id: 1, ...createCourseDto };

    it('should create a course successfully', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null); // No existing course
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockAdminRepository.findOne.mockResolvedValue(mockInstructor);
      mockCourseRepository.create.mockReturnValue(mockCourse);
      mockCourseRepository.save.mockResolvedValue(mockCourse);

      const result = await service.create(createCourseDto);

      expect(result).toEqual(mockCourse);
      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { slugName: createCourseDto.slugName }
      });
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: createCourseDto.categoryId }
      });
      expect(mockAdminRepository.findOne).toHaveBeenCalledWith({
        where: { id: createCourseDto.instructorId }
      });
    });

    it('should throw BadRequestException if course name is missing', async () => {
      const invalidDto = { ...createCourseDto, name: '' };

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if course with same slug exists', async () => {
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);

      await expect(service.create(createCourseDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createCourseDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if instructor not found', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockAdminRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createCourseDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if discount price is greater than or equal to regular price', async () => {
      const invalidDto = { ...createCourseDto, discountPrice: 100.00 };

      mockCourseRepository.findOne.mockResolvedValue(null);
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockAdminRepository.findOne.mockResolvedValue(mockInstructor);

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all courses with relations', async () => {
      const mockCourses = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
      mockCourseRepository.find.mockResolvedValue(mockCourses);

      const result = await service.findAll();

      expect(result).toEqual(mockCourses);
      expect(mockCourseRepository.find).toHaveBeenCalledWith({
        relations: ['category', 'instructor', 'students', 'modules', 'reviews', 'modules.lessons', 'modules.assignments'],
        order: { createdAt: 'DESC' }
      });
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      const mockCourse = { id: 1, name: 'Test Course' };
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCourse);
      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category', 'instructor', 'students', 'modules', 'reviews', 'modules.lessons', 'modules.assignments']
      });
    });

    it('should throw NotFoundException if course not found', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
