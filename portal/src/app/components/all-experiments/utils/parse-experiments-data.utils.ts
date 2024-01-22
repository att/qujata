import { Experiment, ExperimentData, TestRunSubset } from '../hooks';

export function parseExperimentsData(test_suites: Experiment[]) {
  const experimentsData: ExperimentData[] = [];

  test_suites.forEach((experiment: Experiment) => {
    const algorithms = new Set<string>();
    const iterations = new Set<number>();
    experiment.test_runs?.forEach((testRun: TestRunSubset) => {
      algorithms.add(testRun.algorithm);
      iterations.add(testRun.iterations);
    });

    experimentsData.push({
      id: experiment.id,
      name: experiment.name,
      algorithms: Array.from(algorithms),
      iterations: Array.from(iterations),
      end_time: experiment.end_time
    });
  });

  return experimentsData;
}
