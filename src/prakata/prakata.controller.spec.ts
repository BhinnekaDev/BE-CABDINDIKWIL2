import { Test, TestingModule } from '@nestjs/testing';
import { PrakataController } from './prakata.controller';

describe('PrakataController', () => {
  let controller: PrakataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrakataController],
    }).compile();

    controller = module.get<PrakataController>(PrakataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
