import { Test, TestingModule } from '@nestjs/testing';
import { CeritaPraktikBaikService } from './cerita_praktik_baik.service';

describe('CeritaPraktikBaikService', () => {
  let service: CeritaPraktikBaikService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CeritaPraktikBaikService],
    }).compile();

    service = module.get<CeritaPraktikBaikService>(CeritaPraktikBaikService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
