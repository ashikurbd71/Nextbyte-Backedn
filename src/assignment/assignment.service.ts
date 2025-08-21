import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Module } from '../module/entities/module.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
  ) { }

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    try {
      // Check if module exists
      const module = await this.moduleRepository.findOne({
        where: { id: createAssignmentDto.moduleId }
      });

      if (!module) {
        throw new NotFoundException(`Module with ID ${createAssignmentDto.moduleId} not found`);
      }

      const assignment = this.assignmentRepository.create({
        ...createAssignmentDto,
        module: module,
        totalMarks: createAssignmentDto.totalMarks || 100,
        isActive: createAssignmentDto.isActive !== undefined ? createAssignmentDto.isActive : true,
      });

      return await this.assignmentRepository.save(assignment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create assignment');
    }
  }

  async findAll(): Promise<Assignment[]> {
    try {
      return await this.assignmentRepository.find({
        relations: ['module'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch assignments');
    }
  }

  async findActiveAssignments(): Promise<Assignment[]> {
    try {
      return await this.assignmentRepository.find({
        where: { isActive: true },
        relations: ['module'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch active assignments');
    }
  }

  async findOne(id: number): Promise<Assignment> {
    try {
      const assignment = await this.assignmentRepository.findOne({
        where: { id },
        relations: ['module', 'submissions']
      });

      if (!assignment) {
        throw new NotFoundException(`Assignment with ID ${id} not found`);
      }

      return assignment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch assignment');
    }
  }

  async findByModule(moduleId: number): Promise<Assignment[]> {
    try {
      const assignments = await this.assignmentRepository.find({
        where: { module: { id: moduleId } },
        relations: ['module'],
        order: { createdAt: 'DESC' }
      });

      return assignments;
    } catch (error) {
      throw new BadRequestException('Failed to fetch assignments for module');
    }
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    try {
      const assignment = await this.findOne(id);

      // If moduleId is being updated, verify the new module exists
      const updateData = { ...updateAssignmentDto };
      if ('moduleId' in updateData && updateData.moduleId) {
        const module = await this.moduleRepository.findOne({
          where: { id: updateData.moduleId as number }
        });

        if (!module) {
          throw new NotFoundException(`Module with ID ${updateData.moduleId} not found`);
        }

        assignment.module = module;
        delete (updateData as any).moduleId;
      }

      // Update assignment properties
      Object.assign(assignment, updateData);

      return await this.assignmentRepository.save(assignment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update assignment');
    }
  }

  async toggleActive(id: number): Promise<Assignment> {
    try {
      const assignment = await this.findOne(id);
      assignment.isActive = !assignment.isActive;
      return await this.assignmentRepository.save(assignment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to toggle assignment status');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const assignment = await this.findOne(id);
      await this.assignmentRepository.remove(assignment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete assignment');
    }
  }

  async getAssignmentStats(id: number) {
    try {
      const assignment = await this.findOne(id);

      const totalSubmissions = assignment.submissions?.length || 0;
      const submittedCount = assignment.submissions?.filter(s => s.status !== 'pending')?.length || 0;
      const gradedCount = assignment.submissions?.filter(s => s.status === 'reviewed' || s.status === 'approved' || s.status === 'rejected')?.length || 0;

      return {
        assignmentId: id,
        totalSubmissions,
        submittedCount,
        gradedCount,
        pendingGrading: submittedCount - gradedCount
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to get assignment statistics');
    }
  }
}
