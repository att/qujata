import { useEffect, useState } from "react";
import { FetchDataStatus, IHttp, useFetch } from "../../../../../../../shared/hooks/useFetch";
import { getKeysOfData, getLabels, sortDataByAlgorithm } from "../utils/chart.utils";
import { APIS } from "../../../../../../../apis";
import { ITestRunResult, ITestRunResultData } from "../../../../../../../shared/models/test-run-result.interface";

export interface IUseChartsData {
    labels: string[];
    data: ITestRunResultData[];
    keysOfData: string[];
}

export function useChartsData(_data?: ITestRunResultData[]): IUseChartsData {
    const { get, data, cancelRequest, status }: IHttp<ITestRunResult> = useFetch({ url: APIS.testRunResults });
    const [labels, setLabels] = useState<string[]>([]);
    const [sortedData, setSortedData] = useState<ITestRunResultData[]>([]);
    const [keysOfData, setKeysOfData] = useState<string[]>([]);

    useEffect(() => {
        get();
        return cancelRequest;
    }, [get, cancelRequest]);

    useEffect(() => {
        if (status === FetchDataStatus.Success && data) {
            const sortedData: ITestRunResultData[] = sortDataByAlgorithm(data.testRuns);
            setSortedData(sortedData);
            const labels: string[] = getLabels(sortedData);
            setLabels(labels);
            const keysOfData: string[] = getKeysOfData(sortedData[0].results);
            setKeysOfData(keysOfData);
        }
    }, [status, data]);

    return {
        labels,
        data: sortedData,
        keysOfData,
    };
}
