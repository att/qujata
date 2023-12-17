import { IResult, ITestRunResultData } from '../../../../../../../shared/models/test-run-result.interface';
import { ChartKey, ChartTitleDisplayMapping } from '../models/bar-chart.const';

export function sortDataByAlgorithm(dataObject: ITestRunResultData[]) {
    return dataObject.sort((a, b) => {
      if (a.algorithm < b.algorithm) {
        return -1;
      }
      if (a.algorithm > b.algorithm) {
        return 1;
      }
      if (a.iterations < b.iterations) {
        return -1;
      }
      if (a.iterations > b.iterations) {
        return 1;
      }
      return 0;
    });
}

export function getLabels(data: ITestRunResultData[]): string[] {
    return data.map((obj: ITestRunResultData) => `${obj.algorithm}`);
}

export function getKeysOfData(results: IResult): string[] {
    return Object.keys(results);
}

export function getChartTitleByType(type: string): string | undefined {
    return ChartTitleDisplayMapping[type as unknown as ChartKey];
}
