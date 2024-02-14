import { ITestRunResultData } from "../../../../../../../../shared/models/test-run-result.interface";

export const MOCK_DATA_TO_SORT_BY_ALGORITHM: ITestRunResultData[] = [
  {
    id: 1,
    algorithm: "Algorithm1", 
    iterations: 1000,
    message_size: 1024,
    results:  
    { 
      average_cpu: 25.5, 
      average_memory: 512,
      bytes_throughput: 11,
      request_throughput: 21 
    } 
  },
  {
    id: 2,
    algorithm: "Algorithm2", 
    iterations: 100,
    message_size: 2048,
    results:  
    { 
      average_cpu: 25, 
      average_memory: 52,
      bytes_throughput: 11,
      request_throughput: 21 
    } 
  },
  {
    id: 3,
    algorithm: "Algorithm1", 
    iterations: 20000,
    message_size: 1024,
    results:  
    { 
      average_cpu: 25, 
      average_memory: 52,
      bytes_throughput: 11,
      request_throughput: 21 
    } 
  }
];

export const MOCK_DATA_TO_SORT_BY_ITERATION: ITestRunResultData[] = [ 
  {
    id: 1,
    algorithm: "Algorithm1", 
    iterations: 1000,
    message_size: 1024,
    results:  
    { 
      average_cpu: 25.5, 
      average_memory: 512,
      bytes_throughput: 11,
      request_throughput: 21 
    } 
  },
  { 
    id: 2,
    algorithm: "Algorithm1", 
    iterations: 100,
    message_size: 512,
    results:  
    { 
      average_cpu: 25, 
      average_memory: 52,
      bytes_throughput: 11,
      request_throughput: 21
    } 
  },
  { 
    id: 3,
    algorithm: "Algorithm1", 
    iterations: 20000,
    message_size: 1024,
    results:  
    { 
      average_cpu: 25, 
      average_memory: 52,
      bytes_throughput: 11,
      request_throughput: 21 
    } 
  }
];

export const MOCK_DATA_FOR_CHART_UTILS: ITestRunResultData[] = [
  {
    id: 1,
    algorithm: "Algorithm1", 
    iterations: 1000,
    message_size: 1024,
    results:  
    { 
      average_cpu: 25.5, 
      average_memory: 512,
      bytes_throughput: 11,
      request_throughput: 21 
  } 
  },
  {
    id: 2,
    algorithm: "Algorithm2", 
    iterations: 100,
    message_size: 1024,
    results:  
    { 
      average_cpu: 25, 
      average_memory: 52,
      bytes_throughput: 11,
      request_throughput: 21 
    } 
  },
  {
    id: 3,
    algorithm: "Algorithm1", 
    iterations: 20000,
    message_size: 2048,
    results:  
    { 
      average_cpu: 25, 
      average_memory: 52,
      bytes_throughput: 11,
      request_throughput: 21
    } 
  }
];
