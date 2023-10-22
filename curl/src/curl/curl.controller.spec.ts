import { Test, TestingModule } from '@nestjs/testing';
import { CurlController as CurlController } from './curl.controller';
import { CurlService } from './curl.service';

describe('CurlController', () => {
  let controller: CurlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurlController],
      providers: [CurlService],
    }).compile();

    controller = module.get<CurlController>(CurlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
