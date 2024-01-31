import { renderHook } from '@testing-library/react';
import { useFetch } from '../../../../../../shared/hooks/useFetch';
import { useExperimentData } from './useExperimentData';
import { MOCK_DATA_FOR_EXPERIMENT } from '../__mocks__/mocks';
import { useFetchSpinner } from '../../../../../../shared/hooks/useFetchSpinner';
import { useErrorMessage } from '../../../../../../hooks/useErrorMessage';

jest.mock('../../../../../../shared/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}));
jest.mock('../../../../../../shared/hooks/useFetchSpinner');
jest.mock('../../../../../../hooks/useErrorMessage');

describe('useExperimentData', () => {
  test('Should be in Success mode', async () => {
    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: MOCK_DATA_FOR_EXPERIMENT,
      cancelRequest: jest.fn(),
    });
    (useFetchSpinner as jest.Mock).mockImplementation(() => undefined);
    (useErrorMessage as jest.Mock).mockImplementation(() => undefined);

    const mockDataNumOfTestRuns = MOCK_DATA_FOR_EXPERIMENT.test_runs.length;
    const { result } = renderHook(() => useExperimentData());
    
    expect(result.current.data.test_runs.length).toEqual(mockDataNumOfTestRuns);
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