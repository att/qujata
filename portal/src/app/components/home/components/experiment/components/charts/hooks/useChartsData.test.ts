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
          iterations: 2000,
          message_size: 1024,
          results: {
            average_cpu: 25.5,
            average_memory: 512,
            bytes_throughput: 11,
            request_throughput: 21,
          }
        },
        {
          id: 2,
          algorithm: 'Algorithm2',
          iterations: 1000,
          message_size: 512,
          results: {
            average_cpu: 25.5,
            average_memory: 512,
            bytes_throughput: 11,
            request_throughput: 21,
          }
        },
        {
          id: 3,
          algorithm: 'Algorithm1',
          iterations: 500,
          message_size: 1024,
          results: {
              average_cpu: 2,
              average_memory: 52,
              bytes_throughput: 11,
              request_throughput: 21,
          }
        }
      ],
      barChartKeysOfData: [
        'average_cpu',
        'average_memory',
        'bytes_throughput',
        'request_throughput',
      ],
      lineChartData: { labels: [500, 1000, 2000], datasets: [ 
        {
          backgroundColor: "#086CE1",
          borderColor: "#086CE1",
          borderWidth: 1,
          data: {
              average_cpu: [25.5, 2],
              average_memory: [512, 52],
              bytes_throughput: [11, 11],
              request_throughput: [21, 21],
          },
          fill: false,
          label: "Algorithm1       ",
        },
        {
          backgroundColor: "#086CE1",
          borderColor: "#086CE1",
          borderWidth: 1,
          data: {
              average_cpu: [25.5],
              average_memory: [512],
              bytes_throughput: [11],
              request_throughput: [21],
          },
          fill: false,
          label: "Algorithm2       ",
        }
      ]}
    });
  });
});
