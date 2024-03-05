import { CsvDataType } from '../../../../../../../utils/download';
import { MOCK_DATA_FOR_SUB_HEADER_UTILS } from '../__mocks__/mocks';
import { mapExperimentDataToCsvDataType } from './data-to-csv.util';

describe('mapExperimentDataToCsvDataType', () => {
  it('should map the input list to CsvDataType correctly', () => {
    const mockList = MOCK_DATA_FOR_SUB_HEADER_UTILS;

    const expectedOutput: CsvDataType = [
      [ 'ID', 'Algorithm', 'Iterations', 'Average CPU', 'Average Memory' ],
      [ 1, 'App1', 1000, 2000, 3000 ],
      [ 2, 'App2', 4000, 5000, 6000 ]
    ];

    const result = mapExperimentDataToCsvDataType(mockList);
    expect(result).toEqual(expectedOutput);
  });
});
