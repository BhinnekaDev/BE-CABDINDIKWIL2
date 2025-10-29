import { Test, TestingModule } from '@nestjs/testing';
import { SeputarCabdinController } from './seputar-cabdin.controller';

describe('SeputarCabdinController', () => {
  let controller: SeputarCabdinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeputarCabdinController],
    }).compile();

    controller = module.get<SeputarCabdinController>(SeputarCabdinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
