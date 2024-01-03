import { renderHook } from '@testing-library/react';
import { useChartsData } from './useChartsData';
import { FetchDataStatus, useFetch } from '../../../../../../../shared/hooks/useFetch';
import { MOCK_DATA_FOR_CHARTS } from '../__mocks__';

jest.mock('../../../../../../../shared/hooks/useFetch');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        testSuiteId: 'testSuiteId',
    }),
}));
  
describe('useChartsData', () => {
  test('should return charts data', () => {
    (useFetch as jest.Mock).mockImplementation(() => ({ get: jest.fn(), status: FetchDataStatus.Success, data: MOCK_DATA_FOR_CHARTS, cancelRequest: jest.fn()}));

    const { result } = renderHook(() => useChartsData(MOCK_DATA_FOR_CHARTS));
    expect(result.current).toEqual({
      barChartLabels: ['Algorithm1 (iteration 1)       ', 'Algorithm2 (iteration 2)       ', 'Algorithm1 (iteration 3)       '],
      barChartData: [
        {
          id: 1,
          algorithm: 'Algorithm1',
          iterations: 1024,
          results: {
            averageCPU: 25.5,
            averageMemory: 512,
          }
        },
        {
          id: 2,
          algorithm: 'Algorithm2',
          iterations: 1024,
          results: {
            averageCPU: 25.5,
            averageMemory: 512,
          }
        },
        {
          id: 3,
          algorithm: 'Algorithm1',
          iterations: 104,
          results: {
              averageCPU: 2,
              averageMemory: 52,
          }
        }
      ],
      barChartKeysOfData: [
        'averageCPU',
        'averageMemory',
      ],
      lineChartData: { labels: [104, 1024], datasets: [ 
        {
          backgroundColor: "#05BBFF",
          borderColor: "#05BBFF",
          borderWidth: 1,
          data: {
              averageCPU: [25.5, 2],
              averageMemory: [512, 52],
          },
          fill: false,
          label: "Algorithm1       ",
        },
        {
          backgroundColor: "#086CE1",
          borderColor: "#086CE1",
          borderWidth: 1,
          data: {
              averageCPU: [25.5],
              averageMemory: [512],
          },
          fill: false,
          label: "Algorithm2       ",
        }
      ]}
    });
  });
});
