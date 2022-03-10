import { Test, TestingModule } from '@nestjs/testing';
import { FormatoController } from './formato.controller';
import { FormatoService } from './formato.service';

describe('FormatoController', () => {
  let controller: FormatoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormatoController],
      providers: [FormatoService],
    }).compile();

    controller = module.get<FormatoController>(FormatoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
