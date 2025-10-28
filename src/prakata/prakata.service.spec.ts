import { Test, TestingModule } from '@nestjs/testing';
import { PrakataService } from './prakata.service';

describe('PrakataService', () => {
  let service: PrakataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrakataService],
    }).compile();

    service = module.get<PrakataService>(PrakataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
