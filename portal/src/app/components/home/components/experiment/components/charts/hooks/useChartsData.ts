import { useEffect, useState } from "react";
import { getKeysOfData, getLabels } from "../utils/chart.utils";
import { ITestRunResultData } from "../../../../../../../shared/models/test-run-result.interface";
import { ILineChartData } from "../models/line-chart-data.interface";
import { colors } from "../../../../../../dashboard/components/charts/LineChart/LineChart.const";
import { IExperimentData } from "../../../Experiment";

export interface IUseChartsData {
    barChartLabels: string[];
    barChartData: ITestRunResultData[];
    barChartKeysOfData: string[];
    lineChartData: ILineChartData;
}

function processedLineChartData(data: ITestRunResultData[], keysOfData: string[]): ILineChartData {
    const processedData = data.reduce((acc: {[key1: string]: {[key2: string]: number[]}}, curr: any) => {
        keysOfData.forEach((key: string) => {
          if (curr.results[key] !== undefined) {
            if (!acc[curr.algorithm]) {
              acc[curr.algorithm] = { [key]: [curr.results[key]] };
            } else {
              if (!acc[curr.algorithm][key]) {
                acc[curr.algorithm][key] = [curr.results[key]];
              } else {
                acc[curr.algorithm][key].push(curr.results[key]);
              }
            }
          }
        });
        return acc;
      }, {});

      const iterations: number[] = data.map((run: ITestRunResultData) => run.iterations);
      iterations.sort((a: number, b: number) => a - b);
      const uniqueIterations: Set<number> = new Set(iterations);

      const chartData = {
        labels:  Array.from(uniqueIterations),
        datasets: Object.keys(processedData).map((algorithm, index) => {
        const data = keysOfData.reduce((acc: {[key: string]: number[]}, key: string) => {
            acc[key] = processedData[algorithm][key];
            return acc;
        }, {});
            return {
                label: `${algorithm}       `,
                data: data,
                fill: false,
                backgroundColor: colors[index % colors.length],
                borderColor: colors[index % colors.length],
                borderWidth: 1,
            };
        })
      };
      
      return chartData;
}

export function useChartsData(props: IExperimentData): IUseChartsData {
    const [barChartLabels, setBarChartLabels] = useState<string[]>([]);
    const [barChartData, setBarChartData] = useState<ITestRunResultData[]>([]);
    const [barChartKeysOfData, setBarChartKeysOfData] = useState<string[]>([]);
    const [lineChartData, setLineChartData] = useState<ILineChartData>();
    
    useEffect(() => {
        if(props.data && props.data.test_runs.length > 0) {
            const testRuns: ITestRunResultData[] = props.data.test_runs;
            setBarChartData(testRuns);
            const labels: string[] = getLabels(testRuns);
            setBarChartLabels(labels);
            const keysOfData: string[] = getKeysOfData(testRuns[0].results);
            setBarChartKeysOfData(keysOfData);
            const lineChartData: ILineChartData = processedLineChartData(testRuns, keysOfData);
            setLineChartData(lineChartData);
        }
    }, [props.data]);

    return {
        barChartLabels,
        barChartData,
        barChartKeysOfData,
        lineChartData,
    } as IUseChartsData;
}
