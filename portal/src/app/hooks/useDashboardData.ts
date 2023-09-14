import { useCallback, useEffect, useState } from 'react';
import { ChartDataMap, ITestParams, ITestResponse, ITestResponseData } from '../shared/models/quantum.interface';
import { FetchDataStatus, IHttp, useFetch } from '../shared/hooks/useFetch';
import { useFetchSpinner } from '../shared/hooks/useFetchSpinner';
import { APIS } from '../apis';
import { AttSelectOption } from '../shared/components/att-select';

export interface IUseDashboardData {
  data: ChartDataMap;
  algorithms: string[];
  status: FetchDataStatus;
  handleRunQueryClick: (qeuryData: ITestParams) => void;
}

export function useDashboardData(): IUseDashboardData {
  const { post, data, status, error, cancelRequest }: IHttp<ITestResponse> = useFetch<ITestResponse>({ url: APIS.analyze });
  const [dashboardData, setDashboardData] = useState<ChartDataMap>(() => new Map<AttSelectOption, ITestResponseData | undefined>());
  const [algorithms, setAlgorithms] = useState<string[] | undefined>([]);
  const [iterationsCount, setIterationsCount] = useState<number>(1);

  useFetchSpinner(status);
  useEffect(() => cancelRequest, [cancelRequest]);

  useEffect(() => {
    error && console.log('error', error);
  }, [error]);

  useEffect(() => {
    if (status === FetchDataStatus.Success && data) {
        setAlgorithms((prev: string[] | undefined) => {
            prev?.splice(0, 1);
            if (prev && prev.length > 0) {
              post({ data: { algorithm: prev[0], iterationsCount } });
              return prev;
            }
            return undefined;
        });

        setDashboardData((prev: ChartDataMap) => {
            let shouldSkip: boolean = false;
            prev.forEach((value: ITestResponseData | undefined, key: AttSelectOption) => {
              if (!shouldSkip && value === undefined) {
                shouldSkip = true;
                prev.set(key, data.data);
              }
            });

            return prev;
        });
    }
  }, [data, iterationsCount, post, status]);

  const handleRunQueryClick: (qeuryData: ITestParams) => void = useCallback((qeuryData: ITestParams): void => {
    const algos: AttSelectOption[] = qeuryData.algorithms as AttSelectOption[];
    const map: ChartDataMap = new Map<AttSelectOption, ITestResponseData | undefined>();

    const algoValues: string[] = [];
    algos.forEach((algo: AttSelectOption) => {
      map.set(algo, undefined);
      algoValues.push(algo.value);
    });

    setAlgorithms(algoValues);
    setDashboardData(map);
    setIterationsCount(qeuryData.iterationsCount);

    if (algos?.length > 0) {        
      post({ data: { algorithm: algos[0].value, iterationsCount: qeuryData.iterationsCount } });
    }
  }, [post]);

  return {
    handleRunQueryClick,
    data: dashboardData,
    algorithms,
    status,
  } as IUseDashboardData;
}
