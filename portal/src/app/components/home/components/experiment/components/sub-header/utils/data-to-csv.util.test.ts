import { ITestRunResultData } from '../../../../../../../shared/models/test-run-result.interface';
import { CsvDataType } from '../../../../../../../utils/download';
import { mapExperimentDataToCsvDataType } from './data-to-csv.util';

describe('mapExperimentDataToCsvDataType', () => {
  it('should map the input list to CsvDataType correctly', () => {
    const mockList: ITestRunResultData[] = [
      {
        id: 1,
        algorithm: 'App1',
        iterations: 1000,
        results: {
          averageCPU: 2000,
          averageMemory: 3000,
        },
      },
      {
        id: 2,
        algorithm: 'App2',
        iterations: 4000,
        results: {
          averageCPU: 5000,
          averageMemory: 6000,
        },
      },
    ];

    const expectedOutput: CsvDataType = [
      [ 'ID', 'Algorithm', 'Iterations', 'Average CPU', 'Average Memory' ],
      [ 1, 'App1', 1000, 2000, 3000 ],
      [ 2, 'App2', 4000, 5000, 6000 ]
    ];

    const result = mapExperimentDataToCsvDataType(mockList);
    console.log('result ', result);
    expect(result).toEqual(expectedOutput);
  });
});
