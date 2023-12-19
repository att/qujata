import { IResult, ITestRunResultData } from '../../../../../../../shared/models/test-run-result.interface';
import { ChartKey, ChartTitleDisplayMapping } from '../models/bar-chart.const';

export function getLabels(data: ITestRunResultData[]): string[] {
    return data.map((obj: ITestRunResultData) => `${obj.algorithm}`);
}

export function getKeysOfData(results: IResult): string[] {
    return Object.keys(results);
}

export function getChartTitleByType(type: string): string | undefined {
    return ChartTitleDisplayMapping[type as unknown as ChartKey];
}
