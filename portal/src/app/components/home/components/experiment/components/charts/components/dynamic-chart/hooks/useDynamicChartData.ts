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

    for (const testRun of chartData.test_runs) {
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
  return str
  .split('_') // split the string by underscore
  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
  .join(' '); // join the words back together with a space
}
