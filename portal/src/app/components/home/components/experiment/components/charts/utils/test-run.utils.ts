import { ITestRunResultData } from "../../../../../../../shared/models/test-run-result.interface";

export function sortDataByAlgorithm(dataObject: ITestRunResultData[]) {
  return dataObject.sort((a, b) => {
    if (a.algorithm < b.algorithm) {
      return -1;
    }
    if (a.algorithm > b.algorithm) {
      return 1;
    }
    if (a.iterations < b.iterations) {
      return -1;
    }
    if (a.iterations > b.iterations) {
      return 1;
    }
    return 0;
  });
}