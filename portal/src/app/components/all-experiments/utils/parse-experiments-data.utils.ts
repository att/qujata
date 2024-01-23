import { Experiment, ExperimentData, TestRunSubset } from '../hooks';

export function parseExperimentsData(test_suites: Experiment[]) {
  const experimentsData: ExperimentData[] = [];

  test_suites.forEach((experiment: Experiment) => {
    const algorithms = new Set<string>();
    const iterations = new Set<number>();
    const message_sizes = new Set<number>();
    experiment.test_runs?.forEach((testRun: TestRunSubset) => {
      algorithms.add(testRun.algorithm);
      iterations.add(testRun.iterations);
      message_sizes.add(testRun.message_size);
    });

    const sortedAlgorithms = Array.from(algorithms).sort();
    const sortedIterations = Array.from(iterations).sort((a, b) => a - b);
    const sortedMessageSizes = Array.from(message_sizes).sort((a, b) => a - b);

    experimentsData.push({
      id: experiment.id,
      name: experiment.name,
      algorithms: sortedAlgorithms,
      iterations: sortedIterations,
      message_sizes: sortedMessageSizes,
      end_time: experiment.end_time
    });
  });

  return experimentsData;
}
