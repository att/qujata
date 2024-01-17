import { ITestRunResultData } from '../../../shared/models/test-run-result.interface';
import { Experiment, ExperimentData } from '../hooks';

export function parseExperimentsData(test_suites: Experiment[]) {
  const experimentsData: ExperimentData[] = [];

  test_suites.forEach((experiment: Experiment) => {
    const algorithms = new Set<string>();
    const iterations = new Set<number>();
    experiment.testRuns?.forEach((testRun: ITestRunResultData) => {
      algorithms.add(testRun.algorithm);
      iterations.add(testRun.iterations);
    });

    experimentsData.push({
      id: experiment.id ?? 0,
      name: experiment.name ?? '',
      algorithms: Array.from(algorithms),
      iterations: Array.from(iterations),
      end_time: experiment.end_time ?? '',
    });
  });

  return experimentsData;
}
