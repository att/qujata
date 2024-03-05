import { renderHook } from '@testing-library/react';
import { sortDataByAlgorithm } from './test-run.utils';
import { MOCK_DATA_TO_SORT_BY_ALGORITHM, MOCK_DATA_TO_SORT_BY_ITERATION, MOCK_DATA_TO_SORT_BY_MESSAGE_SIZE, MOCK_DATA_WITH_NO_NEED_TO_SORT } from './__mocks__';

describe('test-run utils', () => {
    test('should sort data by algorithm', () => {
        const { result } = renderHook(() => sortDataByAlgorithm(MOCK_DATA_TO_SORT_BY_ALGORITHM));
        expect(result.current[0]).toEqual({
          id: 1,
          algorithm: "Algorithm1", 
          iterations: 1000,
          message_size: 1024,
          results:  
          { 
            average_cpu: 25.5, 
            average_memory: 512,
            bytes_throughput: 11,
            request_throughput: 21,
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
          message_size: 512,
          results:  
          { 
            average_cpu: 25, 
            average_memory: 52,
            bytes_throughput: 11,
            request_throughput: 21,
          } 
        });
    });

    test('should sort data by message size', () => {
      const { result } = renderHook(() => sortDataByAlgorithm(MOCK_DATA_TO_SORT_BY_MESSAGE_SIZE));
      expect(result.current[0]).toEqual({ 
        id: 2,
        algorithm: "Algorithm1", 
        iterations: 1000,
        message_size: 512,
        results:  
        { 
          average_cpu: 25, 
          average_memory: 52,
          bytes_throughput: 11,
          request_throughput: 21
        } 
      });
  });

    test('should not sort data by any parameter', () => {
      const { result } = renderHook(() => sortDataByAlgorithm(MOCK_DATA_WITH_NO_NEED_TO_SORT));
      expect(result.current[0]).toEqual({
        id: 1,
        algorithm: "Algorithm1", 
        iterations: 1000,
        message_size: 1024,
        results:  
        { 
          average_cpu: 25.5, 
          average_memory: 512,
          bytes_throughput: 11,
          request_throughput: 21 
        } 
      });
  });
});
