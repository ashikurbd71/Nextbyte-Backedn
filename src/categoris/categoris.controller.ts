import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe
} from '@nestjs/common';
import { CategorisService } from './categoris.service';
import { CreateCategorisDto } from './dto/create-categoris.dto';
import { UpdateCategorisDto } from './dto/update-categoris.dto';

@Controller('categoris')
export class CategorisController {
  constructor(private readonly categorisService: CategorisService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createCategorisDto: CreateCategorisDto) {
    return await this.categorisService.create(createCategorisDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.categorisService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categorisService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCategorisDto: UpdateCategorisDto
  ) {
    return await this.categorisService.update(id, updateCategorisDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categorisService.remove(id);
  }
}
