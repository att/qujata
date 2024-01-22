import { parseExperimentsData } from './parse-experiments-data.utils';
import { ITestRunResultData } from '../../../shared/models/test-run-result.interface';
import { Experiment, ExperimentData } from '../hooks';

describe('parseExperimentsData', () => {
  it('should parse experiments data correctly', () => {
    const mockExperiments: Experiment[] = [
      {
        id: 1,
        name: 'Experiment 1',
        test_runs: [
          { algorithm: 'Algorithm 1', iterations: 1000 } as ITestRunResultData,
          { algorithm: 'Algorithm 2', iterations: 5000 } as ITestRunResultData,
        ],
        end_time: '2022-01-01T00:00:00Z',
      },
    ];

    const expectedOutput: ExperimentData[] = [
      {
        id: 1,
        name: 'Experiment 1',
        algorithms: ['Algorithm 1', 'Algorithm 2'],
        iterations: [1000, 5000],
        end_time: '2022-01-01T00:00:00Z',
      },
    ];

    const result = parseExperimentsData(mockExperiments);

    expect(result).toEqual(expectedOutput);
  });
});
