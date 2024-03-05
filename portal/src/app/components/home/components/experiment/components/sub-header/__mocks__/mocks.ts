import { ITestRunResultData } from "../../../../../../../shared/models/test-run-result.interface";

export const MOCK_DATA_FOR_SUB_HEADER_UTILS: ITestRunResultData[] = [
  {
    id: 1,
    algorithm: 'App1',
    iterations: 1000,
    message_size: 1024,
    results: {
      average_cpu: 2000,
      average_memory: 3000,
      bytes_throughput: 11,
      request_throughput: 21
    },
  },
  {
    id: 2,
    algorithm: 'App2',
    iterations: 4000,
    message_size: 2048,
    results: {
      average_cpu: 5000,
      average_memory: 6000,
      bytes_throughput: 11,
      request_throughput: 21
    },
  },
];
