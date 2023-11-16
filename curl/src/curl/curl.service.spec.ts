import { Test, TestingModule } from '@nestjs/testing';
import { CurlService } from './curl.service';
import { CurlRequest } from '../dto/curl-request.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HttpException, HttpStatus } from '@nestjs/common';
import * as shellJS from 'shelljs';
jest.mock('shelljs', () => ({
  exec: jest.fn(),
}));
describe('CurlService', () => {
  let curlService: CurlService;
  let configService: ConfigService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurlService,
        ConfigService,
      ],
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              algorithms: ['kyber512'],
              nginx: {
                host: "localhost",
                port: 4433
              }
            }),
          ],
        }),
      ],
    }).compile();
    curlService = module.get<CurlService>(CurlService);
    configService = module.get<ConfigService>(ConfigService);
  });


  
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(curlService).toBeDefined();
  });
  describe('run', () => {
    it('should call validate and runCurls with the correct parameters', async () => {
      const curlRequest: CurlRequest = {
        algorithm: 'kyber512',
        iterationsCount: 1000,
      };
      const validateSpy = jest.spyOn<any, any>(curlService, 'validate');
      const runCurlsSpy = jest.spyOn<any, any>(curlService, 'runCurls').mockResolvedValue(undefined);
      await curlService.run(curlRequest);
      expect(validateSpy).toHaveBeenCalledWith(curlRequest);
      expect(runCurlsSpy).toHaveBeenCalledWith(curlRequest.iterationsCount, curlRequest.algorithm);
    });

    it('should throw an HttpException with status INTERNAL_SERVER_ERROR when runCurls throws an error', async () => {
      const curlRequest: CurlRequest = {
        algorithm: 'kyber512',
        iterationsCount: 1000,
      };
      jest.spyOn<any, any>(curlService, 'runCurls').mockRejectedValue(new HttpException('runCurls error', 500));
      await expect(curlService.run(curlRequest)).rejects.toThrow(HttpException);
      await expect(curlService.run(curlRequest)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "error occured when trying to run test with algorithm: kyber512"
      });
      
    });
    it('should throw an HttpException with status UNPROCESSABLE_ENTITY when algorithm is not supported', async () => {
      const curlRequest: CurlRequest = {
        algorithm: 'unsupported_algorithm',
        iterationsCount: 1000,
      };
      jest.spyOn(configService, 'get').mockReturnValue(['test_algorithm']);
      await expect(curlService.run(curlRequest)).rejects.toThrow(HttpException);
      await expect(curlService.run(curlRequest)).rejects.toMatchObject({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'algorithm: unsupported_algorithm is not supported'
      });
    });
    it('should throw an HttpException with status LOCKED when process is already running', async () => {
      const curlRequest: CurlRequest = {
        algorithm: 'kyber512',
        iterationsCount: 1000,
      };
      jest.spyOn(configService, 'get').mockReturnValue(['test_algorithm']);
      jest.spyOn<any, any>(curlService, 'runCurls').mockImplementation(() => {
        curlService['processIsRunning'] = true;
      });
      await curlService.run(curlRequest);
      await expect(curlService.run(curlRequest)).rejects.toThrow(HttpException);
      await expect(curlService.run(curlRequest)).rejects.toMatchObject({
        status: 423,
      });
      // Reset processIsRunning to false
      curlService['processIsRunning'] = false;
    });

    // Additional test cases for the run method should be added here to cover various scenarios, such as error handling and validation failures.
  });

  describe('validate', () => {
    it('should not throw an error when the input is valid', () => {
      const curlRequest: CurlRequest = {
        algorithm: 'kyber512',
        iterationsCount: 1000,
      };
      jest.spyOn(configService, 'get').mockReturnValue(['test_algorithm']);
      expect(() => curlService['validate'](curlRequest)).not.toThrow();
    });

  });
  describe('runCurls', () => {
    it('should call execAsync with the correct command', async () => {
      const iterationsCount = 1000;
      const algorithm = 'kyber512';
      const execAsyncSpy = jest.spyOn<any, any>(curlService, 'execAsync').mockResolvedValue(undefined);
      await curlService['runCurls'](iterationsCount, algorithm);
      const expectedCommand = curlService['format'](`./scripts/run-curl-loop.sh ${configService.get('nginx.host')} ${configService.get('nginx.port')} ${iterationsCount} ${algorithm}`);
      expect(execAsyncSpy).toHaveBeenCalledWith(expectedCommand);
    });
    // Add more test cases for error handling in runCurls.
  });
  describe('execAsync', () => {
    it('should resolve when shellJS.exec returns a 0 exit code', async () => {
      const command = 'kyber512';
      (shellJS.exec as jest.Mock).mockImplementation((_command, _options, callback) => {
        callback(0, 'stdout', 'stderr');
      });
      await expect(curlService['execAsync'](command)).resolves.toBe('stdout');
    });
    it('should reject when shellJS.exec returns a non-zero exit code', async () => {
      const command = 'kyber512';
      (shellJS.exec as jest.Mock).mockImplementation((_command, _options, callback) => {
        callback(1, 'stdout', 'stderr');
      });
      await expect(curlService['execAsync'](command)).rejects.toBe('stderr');
    });
  });
  describe('format', () => {
    it('should replace placeholders with values', () => {
      const template = 'The quick %s %j over the %d %s.';
      const result = curlService['format'](template, 'brown', { animal: 'fox' }, 42, 'dogs');
      expect(result).toBe('The quick brown {"animal":"fox"} over the 42 dogs.');
    });
  });

});