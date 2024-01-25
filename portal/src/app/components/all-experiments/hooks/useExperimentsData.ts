import { FetchDataStatus, IHttp, useFetch } from '../../../shared/hooks/useFetch';
import { useEffect, useState } from 'react';
import { APIS } from '../../../apis';
import { useFetchSpinner } from '../../../shared/hooks/useFetchSpinner';
import { useErrorMessage } from '../../../hooks/useErrorMessage';
import { Experiment } from '../models/experiments.interface';

export interface IUseExperimentsData {
  testSuites: Experiment[];
  status: FetchDataStatus;
}

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

    return { testSuites: allExperiments, status };
}
