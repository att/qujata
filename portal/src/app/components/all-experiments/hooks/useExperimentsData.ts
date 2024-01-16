import { FetchDataStatus, IHttp, useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState } from "react";
import { APIS } from "../../../apis";
import { useFetchSpinner } from "../../../shared/hooks/useFetchSpinner";
import { useErrorMessage } from "../../../hooks/useErrorMessage";

export interface IUseExperimentsData {
  experiments: Experiment[];
  status: FetchDataStatus;
}

export interface Experiment {
  id: string;
  experimentName: string;
  algorithms: string[];
  iterations: number[];
  messageSizes: number[];
  date: string;
}

export function useExperimentsData(): IUseExperimentsData {
    const [allExperiments, setAllExperiments] = useState<Experiment[]>([]);
    const { get, data, status, cancelRequest, error }: IHttp<IUseExperimentsData> = useFetch({ url: APIS.allExperiments });

    useFetchSpinner(status);
    useErrorMessage(error);
    useEffect(() => {
      get();  
      return cancelRequest;
    }, [get, cancelRequest]);


    useEffect(() => {
      if (status === FetchDataStatus.Success && data) {
        const allExperiments: Experiment[] = data.experiments.map((experiment: Experiment) => ({
          id: experiment.id,
          experimentName: experiment.experimentName,
          algorithms: experiment.algorithms,
          iterations: experiment.iterations,
          messageSizes: experiment.messageSizes,
          date: experiment.date,
        }));
        setAllExperiments(allExperiments);
      }
    }, [data, status]);

    return { experiments: allExperiments, status };
}
