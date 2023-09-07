import { Injectable } from '@nestjs/common';
import * as shellJS from 'shelljs';
import { createReadStream, existsSync } from 'fs';
import { createInterface } from 'readline';
import * as process from 'process';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { CurlData, SamplesData, AnalysisReturnObject } from './entities/analysis.entity';
import { AllowedAlgorithmsType } from './dto/allowed-algorithms.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnalysisService {
  private readonly CURRENT_PLATFORM_OS: NodeJS.Platform;
  private readonly TEMP_STATS_DATA_FILE_NAME: string;
  private readonly CURL_DOCKER_IMAGE_NAME: string;
  private readonly CURL_COMMAND: string;
  private readonly STATS_COMMAND: string;
  private readonly SEARCH_ALL_STATS_PIDS_COMMAND: string;
  private readonly KILL_PIDS_COMMAND: string;
  private readonly DELETE_TEMP_FILE_COMMAND: string;
  private configService: ConfigService;

  constructor(private _configService: ConfigService) {
    this.CURRENT_PLATFORM_OS = process.platform;

    // Same for all Operating Systems:
    this.TEMP_STATS_DATA_FILE_NAME = 'tempStatsData.txt';
    this.configService = _configService;

    // If the pqc-quantum-api runs on Mac
    if (this.CURRENT_PLATFORM_OS === 'darwin' || this.CURRENT_PLATFORM_OS === 'linux') {
      console.log(`Running on ${this.CURRENT_PLATFORM_OS} (Supported)`);

      // Last character is '\n', so removed it.
      this.CURL_DOCKER_IMAGE_NAME = shellJS
        .exec("docker ps --format '{{.Names}}' | grep curl")
        .stdout.split('\n')[0];

      this.SEARCH_ALL_STATS_PIDS_COMMAND =
        'ps | grep "docker stats" | awk \'{print$1}\'';

      this.KILL_PIDS_COMMAND = 'kill ';

      this.DELETE_TEMP_FILE_COMMAND = 'rm -f ' + this.TEMP_STATS_DATA_FILE_NAME;
    } else if (this.CURRENT_PLATFORM_OS === 'win32') {
      console.log(
        'Running on Windows (Partially Supported - some algorithms may not be properly supported)',
      );

      // Last character is '\n', so removed it. And removed "'" from result on Windows.
      this.CURL_DOCKER_IMAGE_NAME = shellJS
        .exec("docker ps --format '{{.Names}}' | findstr curl")
        .stdout.split('\n')[0]
        .replaceAll(/'/g, '');

      const POWERSHELL_FIND_DOCKER_STATS_CMD =
        "Get-Process | Where-Object { $_.ProcessName -Like 'docker' }";

      this.SEARCH_ALL_STATS_PIDS_COMMAND =
        'powershell "' +
        POWERSHELL_FIND_DOCKER_STATS_CMD +
        ' | ForEach-Object { $_.Id }"';

      this.KILL_PIDS_COMMAND = 'taskkill /F /PID ';

      this.DELETE_TEMP_FILE_COMMAND =
        'powershell "rm -fo ' + this.TEMP_STATS_DATA_FILE_NAME + '"';
    } else {
      console.error(
        "Not supported yet - hasn't tested yet with your OS:",
        this.CURRENT_PLATFORM_OS,
      );
      process.exit(0);
    }

    // Same for all Operating Systems:
    this.STATS_COMMAND =
      'docker stats --format "{{ json . }}" >> ' +
      this.TEMP_STATS_DATA_FILE_NAME;

    this.CURL_COMMAND =
      'docker exec ' +
      this.CURL_DOCKER_IMAGE_NAME +
      ` curl https://${this.configService.get('nginx.host')}:${this.configService.get('nginx.port')} -k -w "{\\"totalTime\\": %{time_total}, \\"connectTime\\": %{time_connect}, \\"downloadSpeed\\": %{speed_download}}" -so /dev/null --curves `;
  }

  async create(createAnalysisDto: CreateAnalysisDto): Promise<AnalysisReturnObject> {
    const samples: SamplesData = this.initSamplesData();

    try {
      console.log('Docker curl image name: ', this.CURL_DOCKER_IMAGE_NAME);

      if (existsSync(this.TEMP_STATS_DATA_FILE_NAME)) {
        shellJS.exec(this.DELETE_TEMP_FILE_COMMAND);
        console.log('Removed existing temp file');
      }

      // Only in Windows - need to skip the existing docker images of 'docker compose up' command
      const existingDockerPidsToSkip: string[] =
        (this.CURRENT_PLATFORM_OS === 'win32')
          ? shellJS
              .exec(this.SEARCH_ALL_STATS_PIDS_COMMAND)
              .stdout.replace(/\r/g, '')
              .split('\n')
          : [];

      const statsCmdToKill = shellJS.exec(this.STATS_COMMAND, {
        async: true,
      });
      // console.log('statsCmdToKill pid:', statsCmdToKill.pid);

      await this.waitInMilliseconds(1_500);

      for (let i = 0; i < createAnalysisDto.iterationsCount; i++) {
        console.log('[AnalysisService:create] Iteration number: ', i + 1);
        const currSample = this.takeCurlSample(createAnalysisDto.algorithm);
        if (currSample) {
          samples.totalTime.push(currSample.totalTime);
          samples.connectTime.push(currSample.connectTime);
          samples.downloadSpeed.push(currSample.downloadSpeed);
        }
      }

      console.log('[AnalysisService:create] Finished taking all curl samples');
      await this.waitInMilliseconds(1_500);
      this.killAllStatsCommands(existingDockerPidsToSkip);
      await this.readStatsSamplesData(samples);
    } catch (err) {
      console.error('[AnalysisService:create] Error occurred: ', err);
    }

    return {
      data: samples,
    };
  }

  private takeCurlSample(algorithm: AllowedAlgorithmsType): CurlData | undefined {
    console.log('[AnalysisService:takeCurlSample] Starting sample execute.');

    const syncCurlRes = shellJS.exec(this.CURL_COMMAND + algorithm);
    if (syncCurlRes?.stderr) {
      console.error(
        '[AnalysisService:takeCurlSample] Error occurred in curl command: ',
        syncCurlRes.stderr,
      );
      return undefined;
    }

    const curlResJson = JSON.parse(syncCurlRes?.stdout);
    return {
      totalTime: curlResJson.totalTime,
      connectTime: curlResJson.connectTime,
      downloadSpeed: curlResJson.downloadSpeed,
    };
  }

  private async readStatsSamplesData(samples: SamplesData): Promise<void> {
    console.log(
      '[AnalysisService:readStatsSamplesData] Starting to aggregate stats data',
    );
    const fileStream = createReadStream(this.TEMP_STATS_DATA_FILE_NAME);
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    const readLines = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of readLines) {
      const statsLine = JSON.parse(this.clearUnsupportedCharacters(line));
      if (statsLine?.Name?.includes('nginx')) {
        // Handle Server('nginx' docker-image) stats:
        this.handleStatsLine(statsLine.CPUPerc, samples.serverCpu);
        this.handleStatsLine(statsLine.MemPerc, samples.serverMemory);
      } else if (statsLine?.Name?.includes('curl')) {
        // Handle Client('curl' docker-image) stats:
        this.handleStatsLine(statsLine.CPUPerc, samples.clientCpu);
        this.handleStatsLine(statsLine.MemPerc, samples.clientMemory);
      }
    }

    console.log(
      '[AnalysisService:readStatsSamplesData] Finished to aggregate stats data',
    );
  }

  private handleStatsLine(stat, statSamples): void {
    const value: number = this.convertPercentageToNumber(stat);
    statSamples.push(value);

    // The commented out code will return only the changes across all samples - instead of all samples.
    /*if (!statSamples.length || statSamples[statSamples.length - 1] !== value) {
      statSamples.push(value);
    }*/
  }

  private clearUnsupportedCharacters(line: string): string {
    return line.replace('[2J[H', '');
  }

  private killAllStatsCommands(existingDockerPidsToSkip: string[]): void {
    console.log(
      '[AnalysisService:killAllStatsCommands] Fetching all relevant processes IDs to kill',
    );
    const pidsCmd = shellJS.exec(this.SEARCH_ALL_STATS_PIDS_COMMAND);
    if (pidsCmd?.stdout) {
      const allPids: string = pidsCmd.stdout;

      if (this.CURRENT_PLATFORM_OS === 'darwin' || this.CURRENT_PLATFORM_OS === 'linux') {
        // Convert processIds result to a single row.
        const pidsToKill = pidsCmd.stdout.replace(/\n/g, ' ');
        // Kill all processesIds together in one command.
        shellJS.exec(this.KILL_PIDS_COMMAND + pidsToKill);
        console.log(
          '[AnalysisService:killAllStatsCommands] Killed all active stats command processes leftovers on Mac',
        );
      } else if (this.CURRENT_PLATFORM_OS === 'win32') {
        // Remove unwanted characters.
        const allPidsClean: string = allPids.replace(/\r/g, '');
        // Reduce the PIDs that needs to be skipped if they were existed before.
        const reducedPids: string[] = allPidsClean
          .split('\n')
          .filter((pid) => pid && !existingDockerPidsToSkip.includes(pid));
        // Kill each ProcessId in a separated command.
        for (const pidToKill of reducedPids) {
          shellJS.exec(this.KILL_PIDS_COMMAND + Number(pidToKill));
        }
        console.log(
          '[AnalysisService:killAllStatsCommands] Killed all active stats command processes leftovers on Windows',
        );
      }
    }
  }

  private initSamplesData(): SamplesData {
    return {
      totalTime: [],
      connectTime: [],
      downloadSpeed: [],
      serverMemory: [],
      serverCpu: [],
      clientMemory: [],
      clientCpu: [],
    };
  }

  private waitInMilliseconds(msToWait: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, msToWait);
    });
  }

  private convertNewlineDelimitedJSON(ndjson: string) {
    // Last element after split is empty, so removed it with slice(0, -1).
    return ndjson
      ?.split('\n')
      .slice(0, -1)
      .map((record) => JSON.parse(record));
  }

  private convertPercentageToNumber(valueInPercentage: string): number {
    // Last character is '%', so removed it with slice(0, -1).
    return Number(valueInPercentage.slice(0, -1));
  }
}
