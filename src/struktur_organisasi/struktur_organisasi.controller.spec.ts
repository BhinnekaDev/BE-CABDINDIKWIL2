import { Test, TestingModule } from '@nestjs/testing';
import { StrukturOrganisasiController } from './struktur_organisasi.controller';

describe('StrukturOrganisasiController', () => {
  let controller: StrukturOrganisasiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StrukturOrganisasiController],
    }).compile();

    controller = module.get<StrukturOrganisasiController>(StrukturOrganisasiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
