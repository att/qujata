import { ITestRunResultData } from '../../../../../../../shared/models/test-run-result.interface';
import { CsvDataType } from '../../../../../../../utils/download';
import { SUB_HEADER_EN } from '../translate/en';

const ExperimentDataReportCsvFileTitles: string[] = [
    SUB_HEADER_EN.CSV_REPORT.TABLE.COLUMNS.ID,
    SUB_HEADER_EN.CSV_REPORT.TABLE.COLUMNS.ALGORITHM,
    SUB_HEADER_EN.CSV_REPORT.TABLE.COLUMNS.ITERATIONS,
    SUB_HEADER_EN.CSV_REPORT.TABLE.COLUMNS.AVERAGE_CPU,
    SUB_HEADER_EN.CSV_REPORT.TABLE.COLUMNS.AVERAGE_MEMORY,
];

export function mapExperimentDataToCsvDataType(list: ITestRunResultData[]): CsvDataType {
  return [
    ExperimentDataReportCsvFileTitles,
    ...list.map((item: ITestRunResultData) => [
      item.id,
      item.algorithm,
      item.iterations,
      item.results.average_cpu,
      item.results.average_memory,
    ])];
}
