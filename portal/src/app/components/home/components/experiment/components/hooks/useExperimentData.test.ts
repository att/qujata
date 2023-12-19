import { renderHook } from '@testing-library/react';
import { useFetch } from '../../../../../../shared/hooks/useFetch';
import { useExperimentData } from './useExperimentData';
import { ITestRunResult } from '../../../../../../shared/models/test-run-result.interface';
import { useFetchSpinner } from '../../../../../../shared/hooks/useFetchSpinner';
import { useErrorMessage } from '../../../../../../hooks/useErrorMessage';

jest.mock('../../../../../../shared/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}));
jest.mock('../../../../../../shared/hooks/useFetchSpinner');
jest.mock('../../../../../../hooks/useErrorMessage');

const mockData: ITestRunResult = {
  "id": 1,
  "name": "test1",
  "description": "test1",
  "start_time": "Thu, 14 Dec 2023 15:37:31 GMT",
  "end_time": "Thu, 14 Dec 2023 15:38:39 GMT",
  "environment_info": {
    "codeRelease": "1.1.0",
    "cpu": "RELACE_WITH_CPU",
    "cpuArchitecture": "RELACE_WITH_CPU_ARCHITECTURE",
    "cpuClockSpeed": "RELACE_WITH_CLOCK_SPEED",
    "cpuCores": 0,
    "nodeSize": "RELACE_WITH_NODE_SIZE",
    "operatingSystem": "RELACE_WITH_OPERATING_SYSTEM",
    "resourceName": "RELACE_WITH_RESOURCE_NAME"
  },
 
  "testRuns": [
    {
      "id":1,
      "algorithm": "bikel1",
      "iterations": 1000,
      "results": {
        "averageCPU": 3.5,
        "averageMemory": 3
      }
    },
    {
      "id":2,
      "algorithm": "bikel1",
      "iterations": 2000,
      "results": {
        "averageCPU": 7.0,
        "averageMemory": 6
      }
    },
    {
     "id":3,
      "algorithm": "kyber512",
      "iterations": 1000,
      "results": {
        "averageCPU": 1.7,
        "averageMemory": 2
      }
    },
    {
      "id":4,
      "algorithm": "kyber512",
      "iterations": 2000,
      "results": {
        "averageCPU": 2.6,
        "averageMemory": 2
      }
    }
  ]
};

describe('useExperimentData', () => {
  test('Should be in Success mode', () => {
    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: mockData,
      cancelRequest: jest.fn(),
    });
    (useFetchSpinner as jest.Mock).mockImplementation(() => undefined);
    (useErrorMessage as jest.Mock).mockImplementation(() => undefined);

    const { result } = renderHook(() => useExperimentData());
    const mockDataNumOfTestRuns = mockData.testRuns.length;
    expect(result.current.data.testRuns.length).toEqual(mockDataNumOfTestRuns);
  });

  test('Should not render data', () => {
    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: undefined,
      cancelRequest: jest.fn(),
    });
    (useFetchSpinner as jest.Mock).mockImplementation(() => undefined);
    (useErrorMessage as jest.Mock).mockImplementation(() => undefined);

    const { result } = renderHook(() => useExperimentData());
    expect(result.current.data).toEqual(undefined);
  });
});