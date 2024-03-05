import { getAlgorithmsName, getIterations } from "./sub-header.utils";
import { MOCK_DATA_FOR_SUB_HEADER_UTILS } from '../__mocks__/mocks';

describe('getAlgorithmsName', () => {
  test('should getAlgorithmsName correctly', () => {
    const expectedOutput: string = 'App1, App2';

    const result = getAlgorithmsName(MOCK_DATA_FOR_SUB_HEADER_UTILS);

    expect(result).toEqual(expectedOutput);
  });
});

describe('getIterations', () => {
  test('should getIterations correctly', () => {
    const expectedOutput: string = '1000, 4000';

    const result = getIterations(MOCK_DATA_FOR_SUB_HEADER_UTILS);

    expect(result).toEqual(expectedOutput);
  });
});
