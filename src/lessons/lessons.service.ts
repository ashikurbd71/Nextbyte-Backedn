import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { Module } from '../module/entities/module.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson)
        private lessonRepository: Repository<Lesson>,
        @InjectRepository(Module)
        private moduleRepository: Repository<Module>,
    ) { }

    async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
        // First, find the module to ensure it exists
        const module = await this.moduleRepository.findOne({
            where: { id: createLessonDto.moduleId }
        });

        if (!module) {
            throw new NotFoundException(`Module with ID ${createLessonDto.moduleId} not found`);
        }

        // Create the lesson with the module relationship
        const lesson = this.lessonRepository.create({
            ...createLessonDto,
            module: module
        });

        return await this.lessonRepository.save(lesson);
    }

    async findAll(): Promise<Lesson[]> {
        return await this.lessonRepository.find({
            relations: ['module'],
            order: { order: 'ASC' }
        });
    }

    async findOne(id: number): Promise<Lesson> {
        const lesson = await this.lessonRepository.findOne({
            where: { id },
            relations: ['module']
        });

        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }

        return lesson;
    }

    async findByModule(moduleId: number): Promise<Lesson[]> {
        return await this.lessonRepository.find({
            where: { module: { id: moduleId } },
            relations: ['module'],
            order: { order: 'ASC' }
        });
    }

    async update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
        const lesson = await this.findOne(id);

        // If moduleId is provided, validate and update the module relationship
        if (updateLessonDto.moduleId) {
            const module = await this.moduleRepository.findOne({
                where: { id: updateLessonDto.moduleId }
            });

            if (!module) {
                throw new NotFoundException(`Module with ID ${updateLessonDto.moduleId} not found`);
            }

            lesson.module = module;
        }

        // Update other fields
        Object.assign(lesson, updateLessonDto);
        return await this.lessonRepository.save(lesson);
    }

    async remove(id: number): Promise<void> {
        const lesson = await this.findOne(id);
        await this.lessonRepository.remove(lesson);
    }
}
