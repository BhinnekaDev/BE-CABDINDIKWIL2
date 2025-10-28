import { Test, TestingModule } from '@nestjs/testing';
import { CeritaPraktikBaikController } from './cerita_praktik_baik.controller';

describe('CeritaPraktikBaikController', () => {
  let controller: CeritaPraktikBaikController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CeritaPraktikBaikController],
    }).compile();

    controller = module.get<CeritaPraktikBaikController>(CeritaPraktikBaikController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
