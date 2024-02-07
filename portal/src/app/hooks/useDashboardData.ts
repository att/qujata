import { useCallback, useEffect, useState } from 'react';
import { ChartDataMap, IQueryResponse, ITestParams, ITestResponseData } from '../shared/models/quantum.interface';
import { FetchDataStatus, IHttp, useFetch } from '../shared/hooks/useFetch';
import { useFetchSpinner } from '../shared/hooks/useFetchSpinner';
import { APIS } from '../apis';
import { AttSelectOption } from '../shared/components/att-select';
import { useErrorMessage } from './useErrorMessage';

export interface IUseDashboardData {
  testSuiteId: string;
  status: FetchDataStatus;
  handleRunQueryClick: (queryData: ITestParams) => void;
};

interface ITestRequestData {
  experimentName: string;
  algorithms: string[];
  iterationsCount: number[];
  messageSizes: number[];
  description: string;
};

export function useDashboardData(): IUseDashboardData {
  const { post, data, status, error, cancelRequest }: IHttp<IQueryResponse> = useFetch<IQueryResponse>({ url: APIS.analyze });
  const [testSuiteId, setTestSuiteId] = useState<string>('');

  useFetchSpinner(status);
  useEffect(() => cancelRequest, [cancelRequest]);
  useErrorMessage(error);

  useEffect(() => {
    if (status === FetchDataStatus.Success && data) {
        setTestSuiteId(data.test_suite_id);
    }
  }, [data, status]);

  const handleRunQueryClick: (queryData: ITestParams) => void = useCallback((queryData: ITestParams): void => {
    let algorithmsValues: string[] = [];
    let iterationsValues: number[] = [];
    let messageSizesValues: number[] = [];

    const algorithms = queryData.algorithms as AttSelectOption[];
    algorithmsValues = algorithms.map((algorithm: AttSelectOption) => algorithm.value);

    const iterations = queryData.iterationsCount as AttSelectOption[];
    iterationsValues = iterations.map((iteration: AttSelectOption) => +iteration.value);

    const messageSizes = queryData.messageSizes as AttSelectOption[];
    messageSizesValues = messageSizes.map((messageSize: AttSelectOption) => +messageSize.value);
    
    post({
      data: {
        experimentName: queryData.experimentName ?? '',
        algorithms: algorithmsValues,
        iterationsCount: iterationsValues,
        messageSizes: messageSizesValues,
        description: queryData.description ?? ''
      } as ITestRequestData
    });
  }, [post]);

  return {
    handleRunQueryClick,
    testSuiteId,
    status,
  } as IUseDashboardData;
}
