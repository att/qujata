import { useEffect, useState } from "react";
import { APIS } from "../../../../../../apis";
import { replaceParams } from "../../../../../../shared/utils/replaceParams";
import { useParams } from "react-router-dom";
import { ITestRunResult, ITestRunResultData } from "../../../../../../shared/models/test-run-result.interface";
import { TestRunUrlParams } from "../../../../../../shared/models/url-params.interface";
import { FetchDataStatus, IHttp, useFetch } from "../../../../../../shared/hooks/useFetch";
import { sortDataByAlgorithm } from "../charts/utils/test-run.utils";

export interface IUseExperimentData {
    data: ITestRunResultData[];
}

export function useExperimentData(): IUseExperimentData {
  const [testRunData, setTestRunData] = useState<ITestRunResultData[]>([]);
  const { testSuiteId } = useParams<TestRunUrlParams>();
  const testRunUrl: string = replaceParams(APIS.testRunResults, { testSuiteId });
  const { get, data, cancelRequest, status }: IHttp<ITestRunResult> = useFetch({ url: testRunUrl });
  
  useEffect(() => {
      get();
      return cancelRequest;
  }, [get, cancelRequest]);

  useEffect(() => {
      if (status === FetchDataStatus.Success && data) {
          const sortedData: ITestRunResultData[] = sortDataByAlgorithm(data.testRuns);
          setTestRunData(sortedData);
      }
  }, [status, data]);

  return {
      data: testRunData
  } as IUseExperimentData;
}
