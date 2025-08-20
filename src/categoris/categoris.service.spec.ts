import { Test, TestingModule } from '@nestjs/testing';
import { CategorisService } from './categoris.service';

describe('CategorisService', () => {
  let service: CategorisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorisService],
    }).compile();

    service = module.get<CategorisService>(CategorisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
