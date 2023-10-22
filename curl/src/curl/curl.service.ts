import { Injectable } from '@nestjs/common';
import * as shellJS from 'shelljs';
import { CurlRequest } from '../dto/curl-request.dto';
import { CurlResponse } from '../entities/analysis.entity';
import { ConfigService } from '@nestjs/config';
import { AllowedAlgorithmsType } from './../dto/allowed-algorithms.type';
@Injectable()
export class CurlService {
  private readonly CURL_COMMAND: string;
  private readonly CURL_SCRIPT_PATH: string;

  private configService: ConfigService;

  constructor(private _configService: ConfigService) {
    this.configService = _configService;

    // this.CURL_COMMAND =` curl https://${this.configService.get('nginx.host')}:${this.configService.get('nginx.port')} -k -w "{\\"totalTime\\": %{time_total}, \\"connectTime\\": %{time_connect}, \\"downloadSpeed\\": %{speed_download}}" -so /dev/null --curves `;
    this.CURL_COMMAND =` i=0; (while [ $i -le %s ] ; do (curl https://${this.configService.get('nginx.host')}:${this.configService.get('nginx.port')}  -k  --curves  %s &) ; i=\`expr $i + 1\`;echo iteration num: $i;  done)&`;
    this.CURL_SCRIPT_PATH = "./scripts/run-curl-loop.sh"
  }

  async create(curlRequest: CurlRequest): Promise<CurlResponse> {
    try {
      setTimeout(async () => {this.runCurls(curlRequest.iterationsCount, curlRequest.algorithm)},0);
      console.log('[AnalysisService:create] Finished taking all curl samples');
    } catch (err) {
      console.error('[AnalysisService:create] Error occurred: ', err);
    }
    return undefined;
  }

  async runCurls(iterationsCount: number, algorithm: AllowedAlgorithmsType) {
    (async () => {
      const curlCommand = this.format(`${this.CURL_SCRIPT_PATH} ${this.configService.get('nginx.host')} ${this.configService.get('nginx.port')} ${iterationsCount} ${algorithm}`);

      shellJS.exec(curlCommand, function(code, stdout, stderr) {
        if (stderr) {
          console.error('[AnalysisService:takeCurlSample] Error occurred in curl command: ', stderr);
          return undefined;
        }
      }); 

      // for (let i = 0; i < iterationsCount; i++) {
      //   console.log('[CurlService:create] Iteration number: ', i + 1);
      //   console.log(this.CURL_COMMAND + algorithm);
      //   shellJS.exec(this.CURL_COMMAND + algorithm, function(code, stdout, stderr) {
      //     if (stderr) {
      //       console.error('[AnalysisService:takeCurlSample] Error occurred in curl command: ', stderr);
      //       return undefined;
      //     }
      //   });       
      // }
    })();

    // for (let i = 0; i < iterationsCount; i++) {
    //   console.log('[CurlService:create] Iteration number: ', i + 1);
    //   console.log(this.CURL_COMMAND + algorithm);
      
    //    shellJS.exec(this.CURL_COMMAND + algorithm, function(code, stdout, stderr) {
    //     if (stderr) {
    //       console.error('[AnalysisService:takeCurlSample] Error occurred in curl command: ', stderr);
    //       return undefined;
    //     }
    //   });       
    // }


  }

  format = (...args) => args.shift().replace(/%([jsd])/g, x => x === '%j' ? JSON.stringify(args.shift()) : args.shift())


}
