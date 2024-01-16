import { renderHook } from '@testing-library/react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { Experiment, useExperimentsData } from './useExperimentsData';

jest.mock('../../../shared/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}));
  
describe('useExperimentsData', () => {
  test('Should be in Success mode', () => {
    const allExperimentsMockData = {
      experiments: [
        {
          id: '1',
          name: 'Experiment 1',
          description: 'Experiment 1 description',
        },
        {
          id: '2',
          name: 'Experiment 2',
          description: 'Experiment 2 description',
        },
      ]
    };

    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: allExperimentsMockData,
      cancelRequest: jest.fn(),
    });

    const { result } = renderHook(() => useExperimentsData());
    expect(result.current.experiments.length).toEqual(allExperimentsMockData.experiments.length);
  });
});