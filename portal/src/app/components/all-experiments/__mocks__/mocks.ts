import { Experiment, ExperimentData } from "../models/experiments.interface";

export const MOCK_DATA_FOR_ALL_EXPERIMENTS: Experiment[] = [
  {
    id: 17,
    name: "Experiment 3",
    end_time: 1705389926549,
    test_runs: [
      {
        id: 366,
        algorithm: "prime256v1",
        iterations: 500,
        message_size: 256
      },
      {
        id: 367,
        algorithm: "bikel3",
        iterations: 1000,
        message_size: 2048
      },
      {
        id: 368,
        algorithm: "p256_kyber512",
        iterations: 10000,
        message_size: 1024
      },
      {
        id: 369,
        algorithm: "prime256v1",
        iterations: 5000,
        message_size: 512
      }
    ]
  },
  {
    id: 18,
    name: "Experiment 4",
    end_time: 1705389926549,
    test_runs: [
      {
        id: 370,
        algorithm: "kyber512",
        iterations: 500,
        message_size: 1024
      },
      {
        id: 371,
        algorithm: "kyber512",
        iterations: 1000,
        message_size: 2048
      }
    ]
  }
];

export const MOCK_EXPERIMENTS_DATA_FOR_ALL_EXPERIMENTS: ExperimentData[] = [{
  id: 15,
  name: 'test',
  algorithms: ['algo1', 'algo2'],
  iterations: [100, 500],
  message_sizes: [1024, 2048],
  end_time: 1234
}];
