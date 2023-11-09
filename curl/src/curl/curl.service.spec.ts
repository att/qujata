import { Test, TestingModule } from '@nestjs/testing';
import { CurlService } from './curl.service';

describe('TestService', () => {
  let service: CurlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurlService],
    }).compile();

    service = module.get<CurlService>(CurlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
