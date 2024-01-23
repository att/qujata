import { renderHook } from '@testing-library/react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { Experiment, useExperimentsData } from './useExperimentsData';

jest.mock('../../../shared/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}));
jest.mock('../../../shared/hooks/useFetchSpinner');
jest.mock('../../../hooks/useErrorMessage');
  
describe('useExperimentsData', () => {
  test('Should be in Success mode', () => {
    const allExperimentsMockData: Experiment[] = [
      {
        id: 17,
        name: "Experiment 3",
        end_time: 1705389926549,
        test_runs: [
          {
            id: 366,
            algorithm: "prime256v1",
            iterations: 500,
            message_size: 1024
          },
          {
            id: 367,
            algorithm: "bikel3",
            iterations: 1000,
            message_size: 512
          },
          {
            id: 368,
            algorithm: "p256_kyber512",
            iterations: 10000,
            message_size: 1024
          },
          {
            id: 369,
            algorithm: "prime256v1",
            iterations: 5000,
            message_size: 512
          }
        ]
      },
      {
        id: 18,
        name: "Experiment 4",
        end_time: 1705389926549,
        test_runs: [
          {
            id: 370,
            algorithm: "kyber512",
            iterations: 500,
            message_size: 1024
          },
          {
            id: 371,
            algorithm: "kyber512",
            iterations: 1000,
            message_size: 2048
          }
        ]
      }
    ];

    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: allExperimentsMockData,
      cancelRequest: jest.fn(),
    });

    const { result } = renderHook(() => useExperimentsData());
    expect(result.current.test_suites.length).toEqual(allExperimentsMockData.length);
  });
});