import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('reviews')
// @UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewService.create(createReviewDto);
  }

  @Get('can-review/:courseId')
  // @UseGuards(JwtAuthGuard)
  async canReviewCourse(@Param('courseId', ParseIntPipe) courseId: number, @Request() req) {
    return this.reviewService.validateUserCanReview(req.user.id, courseId);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('my')
  // @UseGuards(JwtAuthGuard)
  findMyReviews(@Request() req) {
    return this.reviewService.findByUser(req.user.id);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.reviewService.findByCourse(courseId);
  }

  @Get('course/:courseId/rating')
  getCourseRating(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.reviewService.getCourseRating(courseId);
  }

  @Get('top-rated')
  getTopRatedCourses(@Query('limit') limit?: number) {
    return this.reviewService.getTopRatedCourses(limit ? parseInt(limit.toString()) : 10);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }
}
