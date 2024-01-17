import { FetchDataStatus, IHttp, useFetch } from '../../../shared/hooks/useFetch';
import { useEffect, useState } from 'react';
import { APIS } from '../../../apis';
import { useFetchSpinner } from '../../../shared/hooks/useFetchSpinner';
import { useErrorMessage } from '../../../hooks/useErrorMessage';
import { ITestRunResult } from '../../../shared/models/test-run-result.interface';
import { parseExperimentsData } from '../utils/parse-experiments-data.utils';

export type Experiment = Partial<ITestRunResult>;
export interface IUseExperimentsData {
  test_suites: Experiment[];
  status: FetchDataStatus;
}
export interface ExperimentData {
  id?: number;
  name?: string;
  algorithms?: string[];
  iterations?: number[];
  end_time?: string;
};

export function useExperimentsData(): IUseExperimentsData {
    const [allExperiments, setAllExperiments] = useState<ExperimentData[]>([]);
    const { get, data, cancelRequest, status, error }: IHttp<IUseExperimentsData> = useFetch({ url: APIS.allExperiments });

    useFetchSpinner(status);
    useErrorMessage(error);
    useEffect(() => {
      get();  
      return cancelRequest;
    }, [get, cancelRequest]);


    useEffect(() => {
      if (data && data.test_suites) {
        const experimentsData: ExperimentData[] = parseExperimentsData(data.test_suites);
        setAllExperiments(experimentsData);
      }
    }, [data, status]);

    return { test_suites: allExperiments, status };
}
