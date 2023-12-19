import { renderHook } from '@testing-library/react';
import { useFetch } from '../../../../../../shared/hooks/useFetch';
import { useExperimentData } from './useExperimentData';
import { MOCK_DATA_FOR_EXPERIMENT } from '../__mocks__';

jest.mock('../../../../../../shared/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}));

describe('useExperimentData', () => {
  test('Should be in Success mode', async () => {
    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: MOCK_DATA_FOR_EXPERIMENT,
      cancelRequest: jest.fn(),
    });

    const mockDataNumOfTestRuns = MOCK_DATA_FOR_EXPERIMENT.testRuns.length;
    const { result } = renderHook(() => useExperimentData());
    
    expect(result.current.data.testRuns.length).toEqual(mockDataNumOfTestRuns);
  });

  test('Should not render data', () => {
    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: undefined,
      cancelRequest: jest.fn(),
    });

    const { result } = renderHook(() => useExperimentData());
    expect(result.current.data).toEqual(undefined);
  });
});