import { useCallback, useEffect, useState } from 'react';
import { ChartDataMap, IQueryResponse, ITestParams, ITestResponseData } from '../shared/models/quantum.interface';
import { FetchDataStatus, IHttp, useFetch } from '../shared/hooks/useFetch';
import { useFetchSpinner } from '../shared/hooks/useFetchSpinner';
import { APIS } from '../apis';
import { AttSelectOption } from '../shared/components/att-select';
import { Environment } from '../../environments/environment';
import { DashBoardPrefixLink } from '../shared/constants/dashboard';
import { useErrorMessage } from './useErrorMessage';

export interface IUseDashboardData {
  // testSuiteId: string;
  link: string;
  status: FetchDataStatus;
  handleRunQueryClick: (queryData: ITestParams) => void;
}

export function useDashboardData(): IUseDashboardData {
  const { post, data, status, error, cancelRequest }: IHttp<IQueryResponse> = useFetch<IQueryResponse>({ url: APIS.analyze });
  const [dashboardData, setDashboardData] = useState<ChartDataMap>(() => new Map<AttSelectOption, ITestResponseData | undefined>());
  const [algorithms, setAlgorithms] = useState<string[]>([]);
  const [iterationsCount, setIterationsCount] = useState<number[]>([]);
  const generateFromTime: number = Date.now();
  const initialLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${generateFromTime}`;
  const [link, setLink] = useState<string>(initialLink);
  const [testSuiteId, setTestSuiteId] = useState<string>('');

  useFetchSpinner(status);
  useEffect(() => cancelRequest, [cancelRequest]);
  useErrorMessage(error);

  useEffect(() => {
    if (status === FetchDataStatus.Success && data) {
        console.log('data', data);
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
  }, [data, status]);

  const handleRunQueryClick: (queryData: ITestParams) => void = useCallback((queryData: ITestParams): void => {
    let algoValues: string[] = [];
    let iterationsValues: number[] = [];
    
    if (queryData.algorithms) {
      const algos = queryData.algorithms as AttSelectOption[];
      const map: ChartDataMap = new Map<AttSelectOption, ITestResponseData | undefined>();
  
      algos.forEach((algo: AttSelectOption) => {
        map.set(algo, undefined);
        algoValues.push(algo.value);
      });
  
      setAlgorithms(algoValues);
      setDashboardData(map);
      algoValues = algos.map((item: AttSelectOption) => item.value); 
    }

    if (queryData.iterationsCount) {
      const iterations = queryData.iterationsCount as AttSelectOption[];
      const map: ChartDataMap = new Map<AttSelectOption, ITestResponseData | undefined>();

      iterations.forEach((iteration: AttSelectOption) => {
        map.set(iteration, undefined);
        iterationsValues.push(+iteration.value);
      });

      setIterationsCount(iterationsValues);
      setDashboardData(map);
      iterationsValues = iterations.map((item: AttSelectOption) => +item.value);
    }
    
    // Send the post request
    post({
      data: {
        experimentName: queryData.experimentName,
        algorithms: algoValues,
        iterationsCount: iterationsValues,
        description: queryData.description
      } 
    });
  }, [post]);

  return {
    handleRunQueryClick,
    link,
    status,
  } as IUseDashboardData;
}
