import { Test, TestingModule } from '@nestjs/testing';
import { CategorisController } from './categoris.controller';
import { CategorisService } from './categoris.service';

describe('CategorisController', () => {
  let controller: CategorisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategorisController],
      providers: [CategorisService],
    }).compile();

    controller = module.get<CategorisController>(CategorisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
