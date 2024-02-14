import { ITestRunResult, ITestRunResultData } from "../../../../../../shared/models/test-run-result.interface";
import { ExperimentTableProps } from "../experiment-table";

export const MOCK_DATA_FOR_EXPERIMENT: ITestRunResult = {
  id: 1,
  name: "TestRun1",
  description: "TestRun1",
  start_time: 1705240065192,
  end_time: 1705240065192,
  environment_info: {
    resourceName: "gddn-aks",
    operatingSystem: "Linux",
    cpu: "3rd Generation Platinum 8370C",
    cpuArchitecture: "Ice Lake",
    cpuCores: 4,
    cpuClockSpeed: "4 MHz",
    nodeSize: "Standard_D4s_v5",
    codeRelease: "1.1.0",
  },
  test_runs: [
    {
      id: 1,
      algorithm: "Algorithm1",
      iterations: 2000,
      message_size: 1024,
      results:
      {
        averageCPU: 25.5,
        averageMemory: 512,
      }
    },
    {
      id: 2,
      algorithm: "Algorithm2",
      iterations: 1000,
      message_size: 1024,
      results:
      {
        averageCPU: 25.5,
        averageMemory: 512,
      }
    },
    {
      id: 3,
      algorithm: "Algorithm1",
      iterations: 1000,
      message_size: 1024,
      results:
      {
        averageCPU: 2,
        averageMemory: 52,
      }
    }
  ]
};

export const MOCK_DATA_FOR_EXPERIMENT_TABLE: ExperimentTableProps = {
  data: {
    id: 1,
    name: "TestRun1",
    description: "TestRun1",
    start_time: 1705240065192,
    end_time: 1705240065192,
    environment_info: {
      resourceName: "gddn-aks",
      operatingSystem: "Linux",
      cpu: "3rd Generation Platinum 8370C",
      cpuArchitecture: "Ice Lake",
      cpuCores: 4,
      cpuClockSpeed: "4 MHz",
      nodeSize: "Standard_D4s_v5",
      codeRelease: "1.1.0",
    },
    test_runs: [
      {
        id: 1,
        algorithm: "Algorithm1",
        iterations: 1000,
        message_size: 1024,
        results:
        {
          averageCPU: 25.5,
          averageMemory: 512,
        }
      },
      {
        id: 2,
        algorithm: "Algorithm2",
        iterations: 2000,
        message_size: 512,
        results:
        {
          averageCPU: 25.5,
          averageMemory: 512,
        }
      },
      {
        id: 3,
        algorithm: "Algorithm1",
        iterations: 500,
        message_size: 2048,
        results:
        {
          averageCPU: 2,
          averageMemory: 52,
        }
      }
    ]
  },
  selectedColumns: [
    {
      label: "Algorithm",
      value: "algorithm",
    },
    {
      label: "Iterations",
      value: "iterations",
    },
    {
      label: "Average CPU",
      value: "averageCPU",
    },
    {
      label: "Average Memory",
      value: "averageMemory",
    },
  ]
};

export const MOCK_DATA_FOR_EXPERIMENT_WITH_NO_TEST_RUNS: ExperimentTableProps = {
  data: {
    id: 1,
    name: "TestRun1",
    description: "TestRun1",
    start_time: 1705240065192,
    end_time: 1705240065192,
    environment_info: { 
      resourceName: "gddn-aks", 
      operatingSystem: "Linux", 
      cpu: "3rd Generation Platinum 8370C",
      cpuArchitecture: "Ice Lake", 
      cpuCores: 4, 
      cpuClockSpeed: "4 MHz", 
      nodeSize: "Standard_D4s_v5", 
      codeRelease: "1.1.0",
    }, 
    test_runs: []
  },
  selectedColumns: [
    {
      label: "Algorithm",
      value: "algorithm",
    },
    {
      label: "Iterations",
      value: "iterations",
    },
    {
      label: "Average CPU",
      value: "averageCPU",
    },
    {
      label: "Average Memory",
      value: "averageMemory",
    },
  ]
};

export const MOCK_SUB_HEADER: ITestRunResult = {
  id: 1,
  name: 'name',
  description: 'description',
  start_time: 1705240065192,
  end_time: 1705240065192,
  environment_info: {
      codeRelease: 'codeRelease',
      cpu: 'cpu',
      cpuArchitecture: 'cpuArchitecture',
      cpuClockSpeed: 'cpuClockSpeed',
      cpuCores: 2,
      nodeSize: 'nodeSize',
      operatingSystem: 'operatingSystem',
      resourceName: 'resourceName',
  },
  test_runs: [
      {
          id:1,
          algorithm: "bikel1",
          iterations: 1000,
          message_size: 1024,
          results: {
            averageCPU: 3.5,
            averageMemory: 3
          }
        },
  ],
};

export const CSV_MOCK: ITestRunResultData[] = [
  {
    id: 1,
    algorithm: 'App1',
    iterations: 1000,
    message_size: 1024,
    results: {
      averageCPU: 2000,
      averageMemory: 3000,
    },
  },
  {
    id: 2,
    algorithm: 'App2',
    iterations: 4000,
    message_size: 2048,
    results: {
      averageCPU: 5000,
      averageMemory: 6000,
    },
  },
];
