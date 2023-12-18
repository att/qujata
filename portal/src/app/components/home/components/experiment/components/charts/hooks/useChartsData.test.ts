import { renderHook } from '@testing-library/react';
import { useChartsData } from './useChartsData';
import { FetchDataStatus, useFetch } from '../../../../../../../shared/hooks/useFetch';
import { ITestRunResult } from '../../../../../../../shared/models/test-run-result.interface';
import { IExperimentData } from '../../../Experiment';

jest.mock('../../../../../../../shared/hooks/useFetch');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        testSuiteId: 'testSuiteId',
    }),
}));

const mockData: IExperimentData = {
  "data": {
    "id": 1,
    "name": "TestRun1",
    "description": "TestRun1",
    "start_time": "2021-07-26T12:00:00.000Z",
    "end_time": "2021-07-26T12:00:00.000Z",
    "environment_info": { 
      "resourceName": "gddn-aks", 
      "operatingSystem": "Linux", 
      "cpu": "3rd Generation Platinum 8370C",
      "cpuArchitecture": "Ice Lake", 
      "cpuCores": 4, 
      "cpuClockSpeed": "4 MHz", 
      "nodeSize": "Standard_D4s_v5", 
      "codeRelease": "1.1.0",
    }, 
    "testRuns": [ 
      {
        "id": 1,
        "algorithm": "Algorithm1", 
        "iterations": 1024, 
        "results":  
        { 
          "averageCPU": 25.5, 
          "averageMemory": 512, 
        } 
      }, 
      { 
        "id": 2,
        "algorithm": "Algorithm2", 
        "iterations": 1024,
        "results":  
        { 
          "averageCPU": 25.5, 
          "averageMemory": 512, 
        } 
      }, 
      { 
        "id": 3,
        "algorithm": "Algorithm1", 
        "iterations": 104,
        "results":  
        { 
          "averageCPU": 2, 
          "averageMemory": 52,
        } 
      }
    ]
  }
};
  
describe('useChartsData', () => {
  test('should return charts data', () => {
    (useFetch as jest.Mock).mockImplementation(() => ({ get: jest.fn(), status: FetchDataStatus.Success, data: mockData, cancelRequest: jest.fn()}));

    const { result } = renderHook(() => useChartsData(mockData));
    expect(result.current).toEqual({
        barChartLabels: [ 'Algorithm1', 'Algorithm2', 'Algorithm1' ],
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
            "backgroundColor": "#05BBFF",
            "borderColor": "#05BBFF",
            "borderWidth": 1,
            "data": {
                "averageCPU": [25.5, 2],
                "averageMemory": [512, 52],
            },
            "fill": false,
            "label": "Algorithm1",
          },
          {
            "backgroundColor": "#086CE1",
            "borderColor": "#086CE1",
            "borderWidth": 1,
            "data": {
                "averageCPU": [25.5],
                "averageMemory": [512],
            },
            "fill": false,
            "label": "Algorithm2",
          }
        ]}
      });
  });
});
