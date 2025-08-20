import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorisService } from './categoris.service';
import { CategorisController } from './categoris.controller';
import { Category } from './entities/categoris.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategorisController],
  providers: [CategorisService],
  exports: [CategorisService],
})
export class CategorisModule { }
