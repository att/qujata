import { useEffect, useState } from "react";
import { FetchDataStatus, IHttp, useFetch } from "../../../../../../../shared/hooks/useFetch";
import { getKeysOfData, getLabels, sortDataByAlgorithm } from "../utils/chart.utils";
import { APIS } from "../../../../../../../apis";
import { ITestRunResult, ITestRunResultData } from "../../../../../../../shared/models/test-run-result.interface";
import { replaceParams } from "../../../../../../../shared/utils/replaceParams";
import { useParams } from "react-router-dom";
import { TChartUrlParams } from "../../../../../../../shared/models/url-params.interface";
import { ILineChartData } from "../models/line-chart-data.interface";
import { colors } from "../../../../../../dashboard/components/charts/LineChart/LineChart.const";

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
                label: algorithm,
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

export function useChartsData(_data?: ITestRunResultData[]): IUseChartsData {
    const { testSuiteId } = useParams<TChartUrlParams>();
    const url: string = replaceParams(APIS.testRunResults, { testSuiteId });
    const { get, data, cancelRequest, status }: IHttp<ITestRunResult> = useFetch({ url });
    const [barChartLabels, setBarChartLabels] = useState<string[]>([]);
    const [barChartData, setBarChartData] = useState<ITestRunResultData[]>([]);
    const [barChartKeysOfData, setBarChartKeysOfData] = useState<string[]>([]);
    const [lineChartData, setLineChartData] = useState<ILineChartData>();
    
    useEffect(() => {
        get();
        return cancelRequest;
    }, [get, cancelRequest]);

    useEffect(() => {
        if (status === FetchDataStatus.Success && data) {
            const sortedData: ITestRunResultData[] = sortDataByAlgorithm(data.testRuns);
            setBarChartData(sortedData);
            const labels: string[] = getLabels(sortedData);
            setBarChartLabels(labels);
            const keysOfData: string[] = getKeysOfData(sortedData[0].results);
            setBarChartKeysOfData(keysOfData);
            const lineChartData: ILineChartData = processedLineChartData(sortedData, keysOfData);
            setLineChartData(lineChartData);
        }
    }, [status, data]);

    return {
        barChartLabels,
        barChartData,
        barChartKeysOfData,
        lineChartData,
    } as IUseChartsData;
}
