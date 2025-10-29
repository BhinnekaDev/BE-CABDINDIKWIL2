import { Test, TestingModule } from '@nestjs/testing';
import { SeputarCabdinService } from './seputar-cabdin.service';

describe('SeputarCabdinService', () => {
  let service: SeputarCabdinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeputarCabdinService],
    }).compile();

    service = module.get<SeputarCabdinService>(SeputarCabdinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
