import { IExperimentData } from "../../../Experiment";

export const MOCK_DATA_FOR_CHARTS: IExperimentData = {
  data: {
    id: 1,
    name: "TestRun1",
    description: "TestRun1",
    start_time: "2021-07-26T12:00:00.000Z",
    end_time: "2021-07-26T12:00:00.000Z",
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
    testRuns: [
      {
        id: 1,
        algorithm: "Algorithm1",
        iterations: 1024,
        results:
        {
          averageCPU: 25.5,
          averageMemory: 512,
        }
      },
      {
        id: 2,
        algorithm: "Algorithm2",
        iterations: 1024,
        results:
        {
          averageCPU: 25.5,
          averageMemory: 512,
        }
      },
      {
        id: 3,
        algorithm: "Algorithm1",
        iterations: 104,
        results:
        {
          averageCPU: 2,
          averageMemory: 52,
        }
      }
    ]
  }
};

export const MOCK_DATA_FOR_BAR_CHART = [{
  algorithm: "Algorithm1",
  iterations: 100,
  results: {
    averageCPU: 2,
    averageMemory: 52,
  },
}];

export const MOCK_DATA_FOR_BAR_CHART_LABELS = ['Algorithm1'];
export const MOCK_DATA_FOR_BAR_CHART_KEYS = ["averageCPU", "averageMemory", "errorRate", "bytesThroughput", "messagesThroughput", "averageTLSHandshakeTime"];
export const MOCK_DATA_FOR_LINE_CHART = {
  datasets: [{
    backgroundColor: "#05BBFF",
    borderColor: "#05BBFF",
    borderWidth: 1,
    fill: false,
    label: "Algorithm1",
    data: {
      averageCPU: [2],
      averageMemory: [3],
    }
  }],
  labels: [24, 104, 122, 124, 1024],
};