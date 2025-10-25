import { Test, TestingModule } from '@nestjs/testing';
import { SatpenService } from './satpen.service';

describe('SatpenService', () => {
  let service: SatpenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SatpenService],
    }).compile();

    service = module.get<SatpenService>(SatpenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
