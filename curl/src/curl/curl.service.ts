import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as shellJS from 'shelljs';
import { CurlRequest } from '../dto/curl-request.dto';
import { CurlResponseDto } from '../dto/curl-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurlService {
  private readonly CURL_SCRIPT_PATH: string;
  private processIsRunning: boolean;

  private configService: ConfigService;

  constructor(private _configService: ConfigService) {
    this.configService = _configService;
    this.processIsRunning = false;
    this.CURL_SCRIPT_PATH = "./scripts/run-curl-loop.sh"
  }

  async run(curlRequest: CurlRequest): Promise<CurlResponseDto> {
    this.validate(curlRequest);
    try {
      return await this.runCurls(curlRequest.iterationsCount, curlRequest.algorithm, curlRequest.messageSize);
    } catch (err) {
      this.processIsRunning = false;
      console.error('[CurlService:run] Error occurred: ', err);
      throw new HttpException("error occurred when trying to run test with algorithm: " + curlRequest.algorithm, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private validate(curlRequest: CurlRequest): void {
    if (!this.configService.get('algorithms',[]).includes(curlRequest.algorithm)) {
      console.error("[CurlService:run] algorithm: " + curlRequest.algorithm + ' is not supported')
      throw new HttpException('algorithm: ' + curlRequest.algorithm + ' is not supported', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (this.processIsRunning === true) {
      console.error("[CurlService:run] curl process is running now")
      throw new HttpException('curl process is running', 423);
    }
  }

  private async runCurls(iterationsCount: number, algorithm: string, messageSize: number) : Promise<CurlResponseDto> {
      const curlCommand = this.format(`${this.CURL_SCRIPT_PATH} ${this.configService.get('nginx.host')} ${this.configService.get('nginx.port')} ${iterationsCount} ${algorithm} ${messageSize}`);
      this.processIsRunning = true;
      const result = await this.execAsync(curlCommand);
      console.log('[CurlService:run] Finished taking all curl samples');
      this.processIsRunning = false;
      return {
          totalRequestSize: parseInt(result)
      };
  }

  private execAsync(command): Promise<string> {
    return new Promise((resolve, reject) => {
      shellJS.exec(command, { async: true }, (code, stdout, stderr) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(stderr);
        }
      });
    });
  }

  format = (...args) => args.shift().replace(/%([jsd])/g, x => x === '%j' ? JSON.stringify(args.shift()) : args.shift())


}
