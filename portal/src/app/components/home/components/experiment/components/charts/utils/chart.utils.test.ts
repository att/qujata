import {renderHook} from "@testing-library/react";
import { getChartTitleByType, getKeysOfData, getLabels, sortDataByAlgorithm } from "./chart.utils";

const mockData = [ 
    { 
      algorithm: "Algorithm1", 
      iterations: 1000, 
      messageSizeBytes: 1024, 
      results:  
      { 
        averageCPU: 25.5, 
        averageMemory: 512, 
        errorRate: 0.05, 
        bytesThroughput: 2048000, 
        messagesThroughput: 500, 
        averageTLSHandshakeTime: 10.2 
	  } 
    },
    { 
        algorithm: "Algorithm2", 
        iterations: 100, 
        messageSizeBytes: 104, 
        results:  
        { 
          averageCPU: 25, 
          averageMemory: 52, 
          errorRate: 0.05, 
          bytesThroughput: 2048000, 
          messagesThroughput: 500, 
          averageTLSHandshakeTime: 10.2 
        } 
      },
      { 
        algorithm: "Algorithm1", 
        iterations: 20000, 
        messageSizeBytes: 104, 
        results:  
        { 
          averageCPU: 25, 
          averageMemory: 52, 
          errorRate: 0.05, 
          bytesThroughput: 2048000, 
          messagesThroughput: 500, 
          averageTLSHandshakeTime: 10.2 
        } 
      }
];

const mockData2 = [ 
    { 
      algorithm: "Algorithm1", 
      iterations: 100, 
      messageSizeBytes: 14, 
      results:  
      { 
        averageCPU: 25.5, 
        averageMemory: 512, 
        errorRate: 0.05, 
        bytesThroughput: 2048000, 
        messagesThroughput: 500, 
        averageTLSHandshakeTime: 10.2 
	  } 
    },
    { 
        algorithm: "Algorithm2", 
        iterations: 100, 
        messageSizeBytes: 104, 
        results:  
        { 
          averageCPU: 25, 
          averageMemory: 52, 
          errorRate: 0.05, 
          bytesThroughput: 2048000, 
          messagesThroughput: 500, 
          averageTLSHandshakeTime: 10.2 
        } 
      },
      { 
        algorithm: "Algorithm1", 
        iterations: 20000, 
        messageSizeBytes: 10, 
        results:  
        { 
          averageCPU: 25, 
          averageMemory: 52, 
          errorRate: 0.05, 
          bytesThroughput: 2048000, 
          messagesThroughput: 500, 
          averageTLSHandshakeTime: 10.2 
        } 
      }
];
describe('Chart utils', () => {
    test('should sort data by algorithm', () => {
        const { result } = renderHook(() => sortDataByAlgorithm(mockData));
        expect(result.current[0]).toEqual(    { 
            algorithm: "Algorithm1", 
            iterations: 1000, 
            messageSizeBytes: 1024, 
            results:  
            { 
              averageCPU: 25.5, 
              averageMemory: 512, 
              errorRate: 0.05, 
              bytesThroughput: 2048000, 
              messagesThroughput: 500, 
              averageTLSHandshakeTime: 10.2 
            } 
          });
        expect(result.current).toEqual(mockData);
    });

    test('should sort data by algorithm and iterations', () => {
        const { result } = renderHook(() => sortDataByAlgorithm(mockData2));
        expect(result.current[0]).toEqual(    { 
            algorithm: "Algorithm1", 
            iterations: 100, 
            messageSizeBytes: 14, 
            results:  
            { 
              averageCPU: 25.5, 
              averageMemory: 512, 
              errorRate: 0.05, 
              bytesThroughput: 2048000, 
              messagesThroughput: 500, 
              averageTLSHandshakeTime: 10.2 
            } 
          });
    });

    test('should sort data by algorithm', () => {
        const { result } = renderHook(() => sortDataByAlgorithm(mockData));
        expect(result.current[0]).toEqual(    { 
            algorithm: "Algorithm1", 
            iterations: 1000, 
            messageSizeBytes: 1024, 
            results:  
            { 
              averageCPU: 25.5, 
              averageMemory: 512, 
              errorRate: 0.05, 
              bytesThroughput: 2048000, 
              messagesThroughput: 500, 
              averageTLSHandshakeTime: 10.2 
            } 
          });
        expect(result.current).toEqual(mockData);
    });

    test('should get labels from data', () => {
        const { result } = renderHook(() => getLabels(mockData));
        expect(result.current).toEqual(['Algorithm1','Algorithm1', 'Algorithm2']);
    });

    test('should get keys of data', () => {
        const { result } = renderHook(() => getKeysOfData(mockData[0].results));
        expect(result.current).toEqual([
            'averageCPU', 
            'averageMemory', 
            'errorRate', 
            'bytesThroughput', 
            'messagesThroughput', 
            'averageTLSHandshakeTime' ]);
    });

    test('should chart title by type', () => {
        const { result } = renderHook(() => getChartTitleByType('averageCPU'));
        expect(result.current).toEqual("Average CPU");
    });
});
