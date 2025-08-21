import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Course } from '../course/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Find the course
    const course = await this.courseRepository.findOne({
      where: { id: createReviewDto.courseId }
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${createReviewDto.courseId} not found`);
    }

    // Find the user entity
    const user = await this.userRepository.findOne({
      where: { id: createReviewDto.userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createReviewDto.userId} not found`);
    }

    // Validate user is active and not banned
    if (!user.isActive) {
      throw new NotFoundException('User account is not active');
    }

    if (user.isBanned) {
      throw new NotFoundException('User account is banned');
    }

    // Check if user is enrolled in the course
    const isEnrolled = await this.courseRepository
      .createQueryBuilder('course')
      .innerJoin('course.students', 'student')
      .where('course.id = :courseId', { courseId: createReviewDto.courseId })
      .andWhere('student.id = :userId', { userId: createReviewDto.userId })
      .getOne();

    if (!isEnrolled) {
      throw new NotFoundException('You must be enrolled in this course to review it');
    }

    // Check if user has already reviewed this course
    const existingReview = await this.reviewRepository.findOne({
      where: { user: { id: createReviewDto.userId }, course: { id: createReviewDto.courseId } }
    });

    if (existingReview) {
      throw new NotFoundException('You have already reviewed this course');
    }

    // Create the review with proper entity relationships
    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      isActive: createReviewDto.isActive ?? true,
      user: user, // Pass the full user entity
      course: course // Pass the full course entity
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update course's average rating
    await this.updateCourseAverageRating(createReviewDto.courseId);

    return savedReview;
  }

  private async updateCourseAverageRating(courseId: number): Promise<void> {
    const ratingData = await this.getCourseRating(courseId);

    // You might want to add an averageRating field to the Course entity
    // For now, we'll just calculate it when needed
    // await this.courseRepository.update(courseId, { averageRating: ratingData.averageRating });
  }

  async validateUserCanReview(userId: number, courseId: number): Promise<{ canReview: boolean; reason?: string }> {
    // Check if user exists and is active
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      return { canReview: false, reason: 'User not found' };
    }

    if (!user.isActive) {
      return { canReview: false, reason: 'User account is not active' };
    }

    if (user.isBanned) {
      return { canReview: false, reason: 'User account is banned' };
    }

    // Check if course exists
    const course = await this.courseRepository.findOne({
      where: { id: courseId }
    });

    if (!course) {
      return { canReview: false, reason: 'Course not found' };
    }

    // Check if user is enrolled
    const isEnrolled = await this.courseRepository
      .createQueryBuilder('course')
      .innerJoin('course.students', 'student')
      .where('course.id = :courseId', { courseId })
      .andWhere('student.id = :userId', { userId })
      .getOne();

    if (!isEnrolled) {
      return { canReview: false, reason: 'You must be enrolled in this course to review it' };
    }

    // Check if user has already reviewed
    const existingReview = await this.findUserReviewForCourse(userId, courseId);
    if (existingReview) {
      return { canReview: false, reason: 'You have already reviewed this course' };
    }

    return { canReview: true };
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: ['user', 'course'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'course']
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByCourse(courseId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { course: { id: courseId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUser(userId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserEntity(user: User): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { user: { id: user.id } },
      relations: ['course'],
      order: { createdAt: 'DESC' }
    });
  }

  async findUserReviewForCourse(userId: number, courseId: number): Promise<Review | null> {
    return await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId }
      },
      relations: ['user', 'course']
    });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }

  async getCourseRating(courseId: number): Promise<any> {
    const reviews = await this.findByCourse(courseId);

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length
    };

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution
    };
  }

  async getTopRatedCourses(limit: number = 10): Promise<any[]> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select([
        'course.id as courseId',
        'course.name as courseName',
        'AVG(review.rating) as averageRating',
        'COUNT(review.id) as totalReviews'
      ])
      .leftJoin('review.course', 'course')
      .groupBy('course.id')
      .having('COUNT(review.id) >= 1')
      .orderBy('averageRating', 'DESC')
      .addOrderBy('totalReviews', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(item => ({
      courseId: item.courseId,
      courseName: item.courseName,
      averageRating: Math.round(parseFloat(item.averageRating) * 10) / 10,
      totalReviews: parseInt(item.totalReviews)
    }));
  }
}
