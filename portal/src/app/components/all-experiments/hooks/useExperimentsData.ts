import { FetchDataStatus, IHttp, useFetch } from '../../../shared/hooks/useFetch';
import { useEffect, useState } from 'react';
import { APIS } from '../../../apis';
import { useFetchSpinner } from '../../../shared/hooks/useFetchSpinner';
import { useErrorMessage } from '../../../hooks/useErrorMessage';
import { ITestRunResult, ITestRunResultData } from '../../../shared/models/test-run-result.interface';

export type TestRunSubset = Pick<ITestRunResultData, 'id' | 'algorithm' | 'iterations' | 'message_size'>;
export type Experiment = Pick<ITestRunResult, 'id' | 'name' | 'end_time'> & { test_runs: TestRunSubset[] };

export interface IUseExperimentsData {
  test_suites: Experiment[];
  status: FetchDataStatus;
}
export interface ExperimentData {
  id: number;
  name: string;
  algorithms: string[];
  iterations: number[];
  message_sizes: number[];
  end_time: number;
};

export function useExperimentsData(): IUseExperimentsData {
    const [allExperiments, setAllExperiments] = useState<Experiment[]>([]);
    const { get, data, cancelRequest, status, error }: IHttp<Experiment[]> = useFetch({ url: APIS.allExperiments });

    useFetchSpinner(status);
    useErrorMessage(error);
    useEffect(() => {
      get();  
      return cancelRequest;
    }, [get, cancelRequest]);


    useEffect(() => {
      if (data) {
        setAllExperiments(data);
      }
    }, [data, status, allExperiments]);

    return { test_suites: allExperiments, status };
}
