export class CurlResponse {
  data: SamplesData;
}

export class SamplesData {
  totalTime: number[];
  connectTime: number[];
  downloadSpeed: number[];
  serverMemory: number[];
  serverCpu: number[];
  clientMemory: number[];
  clientCpu: number[];
}

export class CurlData {
  totalTime: number;
  connectTime: number;
  downloadSpeed: number;
}
