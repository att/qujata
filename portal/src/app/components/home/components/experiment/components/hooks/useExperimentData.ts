import { useEffect, useState } from "react";
import { APIS } from "../../../../../../apis";
import { replaceParams } from "../../../../../../shared/utils/replaceParams";
import { useParams } from "react-router-dom";
import { ITestRunResult, ITestRunResultData } from "../../../../../../shared/models/test-run-result.interface";
import { TestRunUrlParams } from "../../../../../../shared/models/url-params.interface";
import { FetchDataStatus, IHttp, useFetch } from "../../../../../../shared/hooks/useFetch";
import { sortDataByAlgorithm } from "../charts/utils/test-run.utils";
import { useFetchSpinner } from "../../../../../../shared/hooks/useFetchSpinner";
import { useErrorMessage } from "../../../../../../hooks/useErrorMessage";

export interface IUseExperimentData {
    data: ITestRunResult;
    status: FetchDataStatus;
}

export function useExperimentData(): IUseExperimentData {
  const [testRunData, setTestRunData] = useState<ITestRunResult>();
  const { testSuiteId } = useParams<TestRunUrlParams>();
  const testRunUrl: string = replaceParams(APIS.testRunResults, { testSuiteId });
  const { get, data, cancelRequest, status, error }: IHttp<ITestRunResult> = useFetch({ url: testRunUrl });
  
  useFetchSpinner(status);
  useErrorMessage(error);

  useEffect(() => {
      get();
      return cancelRequest;
  }, [get, cancelRequest]);

  useEffect(() => {
      if (data && data.test_runs) {
          const sortedData: ITestRunResultData[] = sortDataByAlgorithm(data.test_runs);
          setTestRunData({ ...data, test_runs: sortedData });
      }
  }, [data]);

  return {
      data: testRunData,
      status,
  } as IUseExperimentData;
}
