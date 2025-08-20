import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) { }

    @Post()
    create(@Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.create(createLessonDto);
    }

    @Get()
    findAll() {
        return this.lessonsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.findOne(id);
    }

    @Get('module/:moduleId')
    findByModule(@Param('moduleId', ParseIntPipe) moduleId: number) {
        return this.lessonsService.findByModule(moduleId);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.update(id, updateLessonDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.remove(id);
    }
}
