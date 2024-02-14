import { IExperimentData } from "../../../Experiment";

export const MOCK_DATA_FOR_CHARTS: IExperimentData = {
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
        iterations: 2000,
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
        iterations: 1000,
        message_size: 512,
        results:
        {
          average_cpu: 25.5,
          average_memory: 512,
          bytes_throughput: 11,
          request_throughput: 21
        }
      },
      {
        id: 3,
        algorithm: "Algorithm1",
        iterations: 500,
        message_size: 1024,
        results:
        {
          average_cpu: 2,
          average_memory: 52,
          bytes_throughput: 11,
          request_throughput: 21
        }
      }
    ]
  }
};

export const MOCK_DATA_FOR_BAR_CHART = [{
  algorithm: "Algorithm1",
  iterations: 100,
  results: {
    average_cpu: 2,
    average_memory: 52,
  },
}];

export const MOCK_DATA_FOR_BAR_CHART_LABELS = ['Algorithm1'];
export const MOCK_DATA_FOR_BAR_CHART_KEYS = ["average_cpu", "average_memory", "errorRate", "bytesThroughput", "messagesThroughput", "averageTLSHandshakeTime"];
export const MOCK_DATA_FOR_LINE_CHART = {
  datasets: [{
    backgroundColor: "#05BBFF",
    borderColor: "#05BBFF",
    borderWidth: 1,
    fill: false,
    label: "Algorithm1",
    data: {
      average_cpu: [2],
      average_memory: [3],
    }
  }],
  labels: [24, 104, 122, 124, 1024],
};