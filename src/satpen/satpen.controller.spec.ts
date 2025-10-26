import { Test, TestingModule } from '@nestjs/testing';
import { SatpenController } from './satpen.controller';

describe('SatpenController', () => {
  let controller: SatpenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SatpenController],
    }).compile();

    controller = module.get<SatpenController>(SatpenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
