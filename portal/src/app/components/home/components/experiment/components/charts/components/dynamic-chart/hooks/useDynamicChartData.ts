import { useEffect, useState } from "react";
import { AttSelectOption } from "../../../../../../../../../shared/components/att-select";
import { ITestRunResult } from "../../../../../../../../../shared/models/test-run-result.interface";

export interface IUseDynamicChartData {
  yAxiosOptions: AttSelectOption[];
}
export function useDynamicChartData(chartData: ITestRunResult): IUseDynamicChartData {
  const [yAxiosOptions, setYAxiosOptions] = useState<AttSelectOption[]>([]);

  useEffect(() => {
    const uniqueKeys = new Set<string>();

    for (const testRun of chartData.testRuns) {
      const results = testRun.results;
      for (const key in results) {
        uniqueKeys.add(key);
      }
    }

    if (uniqueKeys.size > 0) {
      setYAxiosOptions(Array.from(uniqueKeys).map(key => ({ label: convertLabelByCapitalLetter(key), value: key })));
    }
  }, [chartData]);

  return {
    yAxiosOptions,
  };
}

function convertLabelByCapitalLetter(str: string): string {
  let isFirstCapital = true;
  const result = str.replace(/([A-Z])/g, (match) => {
    if (isFirstCapital) {
      isFirstCapital = false;
      return ` ${match}`;
    }
    return match;
  }).trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
}
