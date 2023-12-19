import { renderHook } from '@testing-library/react';
import { sortDataByAlgorithm } from './test-run.utils';
import { MOCK_DATA_TO_SORT_BY_ALGORITHM, MOCK_DATA_TO_SORT_BY_ITERATION } from './__mocks__';

describe('test-run utils', () => {
    test('should sort data by algorithm', () => {
        const { result } = renderHook(() => sortDataByAlgorithm(MOCK_DATA_TO_SORT_BY_ALGORITHM));
        expect(result.current[0]).toEqual({
          id: 1,
          algorithm: "Algorithm1", 
          iterations: 1000,
          results:  
          { 
            averageCPU: 25.5, 
            averageMemory: 512
          } 
        });
        expect(result.current).toEqual(MOCK_DATA_TO_SORT_BY_ALGORITHM);
    });

    test('should sort data by iterations', () => {
        const { result } = renderHook(() => sortDataByAlgorithm(MOCK_DATA_TO_SORT_BY_ITERATION));
        expect(result.current[0]).toEqual({
          id: 2, 
          algorithm: "Algorithm1", 
          iterations: 100,
          results:  
          { 
            averageCPU: 25, 
            averageMemory: 52
          } 
        });
    });
});
