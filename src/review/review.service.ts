import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) { }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return await this.reviewRepository.save(review);
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
