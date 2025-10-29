import { Test, TestingModule } from '@nestjs/testing';
import { InovasiController } from './inovasi.controller';

describe('InovasiController', () => {
  let controller: InovasiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InovasiController],
    }).compile();

    controller = module.get<InovasiController>(InovasiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
