import { ITestResultData } from "../../../../../../../models/test-result.interface";
import { getLabels, sortDataByAlgorithm } from "../utils/chart.utils";

export interface IUseChartsData {
    labels: string[];
    data: ITestResultData[];
}

export function useChartsData(data: ITestResultData[]): IUseChartsData {
    const sortedData: ITestResultData[] = sortDataByAlgorithm(data);
    const labels: string[] = getLabels(sortedData);

    return {
        labels,
        data: sortedData,
    };
}
