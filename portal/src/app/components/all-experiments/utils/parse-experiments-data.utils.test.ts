import { parseExperimentsData } from './parse-experiments-data.utils';
import { Experiment, ExperimentData, TestRunSubset } from '../hooks';

describe('parseExperimentsData', () => {
  it('should parse experiments data correctly', () => {
    const mockExperiments: Experiment[] = [
      {
        id: 1,
        name: 'Experiment 1',
        test_runs: [
          { algorithm: 'Algorithm 1', iterations: 1000, message_size: 512 } as TestRunSubset,
          { algorithm: 'Algorithm 2', iterations: 5000, message_size: 1024 } as TestRunSubset,
        ],
        end_time: 1705240065192,
      },
    ];

    const expectedOutput: ExperimentData[] = [
      {
        id: 1,
        name: 'Experiment 1',
        algorithms: ['Algorithm 1', 'Algorithm 2'],
        iterations: [1000, 5000],
        message_sizes: [512, 1024],
        end_time: 1705240065192,
      },
    ];

    const result = parseExperimentsData(mockExperiments);

    expect(result).toEqual(expectedOutput);
  });
});
