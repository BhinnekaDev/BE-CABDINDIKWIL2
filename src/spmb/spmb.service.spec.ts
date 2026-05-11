import { Test, TestingModule } from '@nestjs/testing';
import { SpmbService } from './spmb.service';

describe('SpmbService', () => {
  let service: SpmbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpmbService],
    }).compile();

    service = module.get<SpmbService>(SpmbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
