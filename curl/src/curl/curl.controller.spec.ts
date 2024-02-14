import { Test, TestingModule } from '@nestjs/testing';
import { CurlController } from './curl.controller';
import { CurlService } from './curl.service';
import { CurlRequest } from '../dto/curl-request.dto';
import { HttpException } from '@nestjs/common';
import { CurlResponseDto } from "../dto/curl-response.dto";
describe('CurlController', () => {
  let curlController: CurlController;
  let curlService: CurlService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurlController],
      providers: [
        {
          provide: CurlService,
          useFactory: () => ({
            run: jest.fn(),
          }),
        },
      ],
    }).compile();
    curlController = module.get<CurlController>(CurlController);
    curlService = module.get<CurlService>(CurlService);
  });
  it('should be defined', () => {
    expect(curlController).toBeDefined();
  });
  describe('create', () => {
    it('should call the CurlService run method with the correct parameters', async () => {
      const curlRequest: CurlRequest = {
        algorithm: 'kyber512',
        iterationsCount: 500,
        messageSize: 10
      };
      const runSpy = jest.spyOn(curlService, 'run');
      await curlController.create(curlRequest);
      expect(runSpy).toHaveBeenCalledWith(curlRequest);
    });
    it('should return the result of the CurlService run method', async () => {
      const curlRequest: CurlRequest = {
        algorithm: 'kyber512',
        iterationsCount: 500,
        messageSize: 10
      };
      const expectedResult = new CurlResponseDto();
      expectedResult.totalRequestSize = 123;
      jest.spyOn(curlService, 'run').mockResolvedValue(expectedResult);
      const result = await curlController.create(curlRequest);
      expect(result).toBe(expectedResult);
    });
    it('should throw an HttpException if the CurlService run method throws an error', async () => {
      const curlRequest: CurlRequest = {
        algorithm: 'kyber512',
        iterationsCount: 500,
        messageSize: 10
      };
      const error = new HttpException('Exception', 409);
      jest.spyOn(curlService, 'run').mockRejectedValue(error);
      await expect(curlController.create(curlRequest)).rejects.toThrow(HttpException);
    });
    
  });
});