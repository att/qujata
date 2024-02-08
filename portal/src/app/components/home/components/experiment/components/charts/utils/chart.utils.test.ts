import { renderHook } from '@testing-library/react';
import { getChartTitleByType, getKeysOfData, getLabels } from './chart.utils';
import { MOCK_DATA_FOR_CHART_UTILS } from './__mocks__';

describe('Chart utils', () => {
    test('should get labels from data', () => {
        const { result } = renderHook(() => getLabels(MOCK_DATA_FOR_CHART_UTILS));
        expect(result.current).toEqual(['Algorithm1 (iteration 1)       ', 'Algorithm2 (iteration 2)       ', 'Algorithm1 (iteration 3)       ']);
    });

    test('should get keys of data', () => {
        const { result } = renderHook(() => getKeysOfData(MOCK_DATA_FOR_CHART_UTILS[0].results));
        expect(result.current).toEqual(['averageCPU', 'averageMemory', 'bytes_throughput', 'request_throughput']);
    });

    test('should chart title by type', () => {
        const { result } = renderHook(() => getChartTitleByType('averageCPU'));
        expect(result.current).toEqual("Server Memory (%) vs.  Average CPU");
    });
});
