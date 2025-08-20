import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategorisDto } from './dto/create-categoris.dto';
import { UpdateCategorisDto } from './dto/update-categoris.dto';
import { Category } from './entities/categoris.entity';


@Injectable()
export class CategorisService {
  constructor(
    @InjectRepository(Category)
    private categorisRepository: Repository<Category>,
  ) { }

  async create(createCategorisDto: CreateCategorisDto) {
    try {
      // Check if category with same name already exists
      const existingCategory = await this.categorisRepository.findOne({
        where: { name: createCategorisDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }

      const category = this.categorisRepository.create(createCategorisDto);
      const savedCategory = await this.categorisRepository.save(category);

      return {
        statusCode: 201,
        message: 'Category created successfully',
        data: savedCategory,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to create category');
    }
  }

  async findAll() {
    try {
      const categories = await this.categorisRepository.find({
        order: { id: 'ASC' },
      });

      return {
        statusCode: 200,
        message: 'Categories retrieved successfully',
        data: categories,
        count: categories.length,
      };
    } catch (error) {
      throw new Error('Failed to retrieve categories');
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categorisRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return {
        statusCode: 200,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to retrieve category');
    }
  }

  async update(id: number, updateCategorisDto: UpdateCategorisDto) {
    try {
      const category = await this.categorisRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Check if name is being updated and if it conflicts with existing category
      const newName = (updateCategorisDto as any).name;
      if (newName && newName !== category.name) {
        const existingCategory = await this.categorisRepository.findOne({
          where: { name: newName },
        });

        if (existingCategory) {
          throw new ConflictException('Category with this name already exists');
        }
      }

      await this.categorisRepository.update(id, updateCategorisDto);
      const updatedCategory = await this.categorisRepository.findOne({
        where: { id },
      });

      return {
        statusCode: 200,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to update category');
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categorisRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      await this.categorisRepository.remove(category);

      return {
        statusCode: 200,
        message: 'Category deleted successfully',
        data: { id },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete category');
    }
  }
}
