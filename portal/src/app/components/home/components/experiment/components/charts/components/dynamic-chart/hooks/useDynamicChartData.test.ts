import { act, renderHook } from "@testing-library/react";
import { useDynamicChartData } from "./useDynamicChartData";
import { MOCK_DATA_FOR_EXPERIMENT } from "../../../../__mocks__/mocks";

describe('useDynamicChartData', () => {
  test('should get data', async () => {

    const { result } = renderHook(() => useDynamicChartData(MOCK_DATA_FOR_EXPERIMENT));
    act(() => {
        expect(result.current).toEqual( {yAxiosOptions: [{label: "averageCPU", value: "averageCPU"}, {label: "averageMemory", value: "averageMemory"}]});
    });
  });
});
