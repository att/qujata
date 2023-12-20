import { ITestRunResultData } from "../../../../../../../../shared/models/test-run-result.interface";

export const MOCK_DATA_TO_SORT_BY_ALGORITHM: ITestRunResultData[] = [
  {
    id: 1,
    algorithm: "Algorithm1", 
    iterations: 1000,
    results:  
    { 
      averageCPU: 25.5, 
      averageMemory: 512, 
    } 
  },
  {
    id: 2,
    algorithm: "Algorithm2", 
    iterations: 100,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52, 
    } 
  },
  {
    id: 3,
    algorithm: "Algorithm1", 
    iterations: 20000,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52, 
    } 
  }
];

export const MOCK_DATA_TO_SORT_BY_ITERATION: ITestRunResultData[] = [ 
  {
    id: 1,
    algorithm: "Algorithm1", 
    iterations: 1000,
    results:  
    { 
      averageCPU: 25.5, 
      averageMemory: 512, 
    } 
  },
  { 
    id: 2,
    algorithm: "Algorithm1", 
    iterations: 100,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52,
    } 
  },
  { 
    id: 3,
    algorithm: "Algorithm1", 
    iterations: 20000,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52, 
    } 
  }
];

export const MOCK_DATA_FOR_CHART_UTILS: ITestRunResultData[] = [
  {
    id: 1,
    algorithm: "Algorithm1", 
    iterations: 1000,
    results:  
    { 
      averageCPU: 25.5, 
      averageMemory: 512, 
  } 
  },
  {
    id: 2,
    algorithm: "Algorithm2", 
    iterations: 100,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52, 
    } 
  },
  {
    id: 3,
    algorithm: "Algorithm1", 
    iterations: 20000,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52, 
    } 
  }
];
