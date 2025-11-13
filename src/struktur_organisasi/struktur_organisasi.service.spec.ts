import { Test, TestingModule } from '@nestjs/testing';
import { StrukturOrganisasiService } from './struktur_organisasi.service';

describe('StrukturOrganisasiService', () => {
  let service: StrukturOrganisasiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StrukturOrganisasiService],
    }).compile();

    service = module.get<StrukturOrganisasiService>(StrukturOrganisasiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
