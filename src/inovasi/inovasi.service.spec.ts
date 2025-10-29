import { Test, TestingModule } from '@nestjs/testing';
import { InovasiService } from './inovasi.service';

describe('InovasiService', () => {
  let service: InovasiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InovasiService],
    }).compile();

    service = module.get<InovasiService>(InovasiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
