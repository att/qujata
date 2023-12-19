import { renderHook } from '@testing-library/react';
import { useChartsData } from './useChartsData';
import { FetchDataStatus, useFetch } from '../../../../../../../shared/hooks/useFetch';

jest.mock('../../../../../../../shared/hooks/useFetch');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        testSuiteId: 'testSuiteId',
    }),
}));

const mockData = { 
    "environment_info": { 
      "resourceName": "gddn-aks", 
      "operatingSystem": "Linux", 
      "cpu": "3rd Generation Platinum 8370C",
      "cpuArchitecture": "Ice Lake", 
      "cpuCores": "4", 
      "cpuClockSpeed": "4 MHz", 
      "nodeSize": "Standard_D4s_v5", 
      "codeRelease": "1.1.0", 
      "testSuiteId": 108,
      "testSuiteName": "my experiment"
    }, 
    "testRuns": [ 
      { 
        "algorithm": "Algorithm1", 
        "iterations": 1000, 
        "messageSizeBytes": 1024, 
        "results":  
        { 
          "averageCPU": 25.5, 
          "averageMemory": 512, 
          "errorRate": 0.05, 
          "bytesThroughput": 2048000, 
          "messagesThroughput": 500, 
          "averageTLSHandshakeTime": 10.2 
          } 
      }, 
      { 
        "algorithm": "Algorithm2", 
        "iterations": 1000, 
        "messageSizeBytes": 1024, 
        "results":  
        { 
          "averageCPU": 25.5, 
          "averageMemory": 512, 
          "errorRate": 0.05, 
          "bytesThroughput": 2048000, 
          "messagesThroughput": 500, 
          "averageTLSHandshakeTime": 10.2 
        } 
      }, 
      { 
        "algorithm": "Algorithm1", 
        "iterations": 100, 
        "messageSizeBytes": 104, 
        "results":  
        { 
          "averageCPU": 2, 
          "averageMemory": 52, 
          "errorRate": 0.05, 
          "bytesThroughput": 2000, 
          "messagesThroughput": 50, 
          "averageTLSHandshakeTime": 10
        } 
      }
    ]
};
  
describe('useChartsData', () => {
  test('should return charts data', () => {
    (useFetch as jest.Mock).mockImplementation(() => ({ get: jest.fn(), status: FetchDataStatus.Success, data: mockData,  cancelRequest: jest.fn()}));

    const { result } = renderHook(() => useChartsData());
    expect(result.current).toEqual({
        barChartLabels: [ 'Algorithm1', 'Algorithm1', 'Algorithm2' ],
        barChartData: [
          {
            algorithm: 'Algorithm1',
            iterations: 100,
            messageSizeBytes: 104,
            results: {
                averageCPU: 2,
                averageMemory: 52,
                errorRate: 0.05,
                bytesThroughput: 2000,
                messagesThroughput: 50,
                averageTLSHandshakeTime: 10
            }
          },
          {
            algorithm: 'Algorithm1',
            iterations: 1000,
            messageSizeBytes: 1024,
            results: {
                averageCPU: 25.5,
                averageMemory: 512,
                errorRate: 0.05,
                bytesThroughput: 2048000,
                messagesThroughput: 500,
                averageTLSHandshakeTime: 10.2
            }
          },
          {
            algorithm: 'Algorithm2',
            iterations: 1000,
            messageSizeBytes: 1024,
            results: {
                averageCPU: 25.5,
                averageMemory: 512,
                errorRate: 0.05,
                bytesThroughput: 2048000,
                messagesThroughput: 500,
                averageTLSHandshakeTime: 10.2
            }
          }
        ],
        barChartKeysOfData: [
          'averageCPU',
          'averageMemory',
          'errorRate',
          'bytesThroughput',
          'messagesThroughput',
          'averageTLSHandshakeTime'
        ],
        lineChartData: { labels: [ 104, 1024 ], datasets: [ 
            {
                "backgroundColor": "#05BBFF",
                "borderColor": "#05BBFF",
                "borderWidth": 1,
                "data": {
                    "averageCPU": [2,25.5,],
                    "averageMemory": [52,512,],
                    "errorRate": [0.05,0.05,],
                    "bytesThroughput": [2000,2048000,],
                    "messagesThroughput": [50,500,],
                    "averageTLSHandshakeTime": [10,10.2,]
                },
                "fill": false,
                "label": "Algorithm1",
            },
            {
                "backgroundColor": "#086CE1",
                "borderColor": "#086CE1",
                "borderWidth": 1,
                "data": {
                    "averageCPU": [25.5,],
                    "averageMemory": [512,],
                    "errorRate": [0.05,],
                    "bytesThroughput": [2048000,],
                    "messagesThroughput": [500,],
                    "averageTLSHandshakeTime": [10.2,]
                },
                "fill": false,
                "label": "Algorithm2",
            }
     ] }
      });
  });
});
