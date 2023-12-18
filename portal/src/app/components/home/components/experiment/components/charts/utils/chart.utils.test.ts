import { renderHook } from '@testing-library/react';
import { getChartTitleByType, getKeysOfData, getLabels } from './chart.utils';
import { ITestRunResultData } from '../../../../../../../shared/models/test-run-result.interface';

const mockData: ITestRunResultData[] = [
  {
    id: 1,
    algorithm: "Algorithm1", 
    iterations: 1000,
    results:  
    { 
      averageCPU: 25.5, 
      averageMemory: 512, 
  } 
  },
  {
    id: 2,
    algorithm: "Algorithm2", 
    iterations: 100,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52, 
    } 
  },
  {
    id: 3,
    algorithm: "Algorithm1", 
    iterations: 20000,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52, 
    } 
  }
];

const mockData2: ITestRunResultData[] = [ 
  {
    id: 1,
    algorithm: "Algorithm1", 
    iterations: 100,
    results:  
    { 
      averageCPU: 25.5, 
      averageMemory: 512, 
    } 
  },
  { 
    id: 2,
    algorithm: "Algorithm2", 
    iterations: 100,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52,
    } 
  },
  { 
    id: 3,
    algorithm: "Algorithm1", 
    iterations: 20000,
    results:  
    { 
      averageCPU: 25, 
      averageMemory: 52, 
    } 
  }
];
describe('Chart utils', () => {
    test('should get labels from data', () => {
        const { result } = renderHook(() => getLabels(mockData));
        expect(result.current).toEqual(['Algorithm1', 'Algorithm2', 'Algorithm1']);
    });

    test('should get keys of data', () => {
        const { result } = renderHook(() => getKeysOfData(mockData[0].results));
        expect(result.current).toEqual(['averageCPU', 'averageMemory']);
    });

    test('should chart title by type', () => {
        const { result } = renderHook(() => getChartTitleByType('averageCPU'));
        expect(result.current).toEqual("Average CPU");
    });
});
