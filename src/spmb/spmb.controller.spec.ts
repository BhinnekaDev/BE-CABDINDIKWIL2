import { Test, TestingModule } from '@nestjs/testing';
import { SpmbController } from './spmb.controller';

describe('SpmbController', () => {
  let controller: SpmbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpmbController],
    }).compile();

    controller = module.get<SpmbController>(SpmbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
