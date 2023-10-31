import { set } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ChartDataMap, IQueryResponse, ITestParams, ITestResponse, ITestResponseData } from '../shared/models/quantum.interface';
import { FetchDataStatus, IHttp, useFetch } from '../shared/hooks/useFetch';
import { useFetchSpinner } from '../shared/hooks/useFetchSpinner';
import { APIS } from '../apis';
import { AttSelectOption } from '../shared/components/att-select';
import { Environment } from '../../environments/environment';
import { DashBoardPrefixLink } from '../shared/constants/dashboard';

export interface IUseDashboardData {
  link: string;
  // data: ChartDataMap;
  // algorithms: string[];
  status: FetchDataStatus;
  handleRunQueryClick: (qeuryData: ITestParams) => void;
}

export function useDashboardData(): IUseDashboardData {
  // const { post, data, status, error, cancelRequest }: IHttp<ITestResponse> = useFetch<ITestResponse>({ url: APIS.analyze });
  const { post, data, status, error, cancelRequest }: IHttp<IQueryResponse> = useFetch<IQueryResponse>({ url: APIS.analyze });
  const [dashboardData, setDashboardData] = useState<ChartDataMap>(() => new Map<AttSelectOption, ITestResponseData | undefined>());
  const [algorithms, setAlgorithms] = useState<string[] | undefined>([]);
  const [iterationsCount, setIterationsCount] = useState<number>(1);
  const generateFromTime: number = Date.now();
  const initialLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${generateFromTime}&to=1698747480624`;
  const [link, setLink] = useState<string>(initialLink);

  useFetchSpinner(status);
  useEffect(() => cancelRequest, [cancelRequest]);

  useEffect(() => {
    error && console.log('error', error);
  }, [error]);

  useEffect(() => {
    if (status === FetchDataStatus.Success && data) {
        const dashboardLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${data.from}&to=${data.to}`;
        setLink(dashboardLink);
        // setAlgorithms((prev: string[] | undefined) => {
        //     prev?.splice(0, 1);
        //     if (prev && prev.length > 0) {
        //       post({ data: { algorithm: prev[0], iterationsCount } });
        //       return prev;
        //     }
        //     return undefined;
        // });

        // setDashboardData((prev: ChartDataMap) => {
        //     let shouldSkip: boolean = false;
        //     prev.forEach((value: ITestResponseData | undefined, key: AttSelectOption) => {
        //       if (!shouldSkip && value === undefined) {
        //         shouldSkip = true;
        //         prev.set(key, data.data);
        //       }
        //     });

        //     return prev;
        // });
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
    link,
    // data: dashboardData,
    // algorithms,
    status,
  } as IUseDashboardData;
}
