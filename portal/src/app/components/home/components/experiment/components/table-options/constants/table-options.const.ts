import { EXPERIMENT_TABLE_EN } from '../../experiment-table/translate/en';
import { Environment } from "../../../../../../../../environments/environment";
import { DashBoardPrefixLink } from "../../../../../../../shared/constants/dashboard";
import { IResult, ITestRunResultData } from '../../../../../../../shared/models/test-run-result.interface';

type SelectedColumnsDefaultData = {
  label: keyof ITestRunResultData | `results.${keyof IResult}`;
  value: string;
};

const generateFromTime: number = Date.now();
export const initialLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${generateFromTime}`;

export const TableOptionsData = {
  options: [
    EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.MESSAGE_SIZE,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_CPU,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_MEMORY,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.THROUGHPUT_BYTES,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.THROUGHPUT_REQUEST,
  ]
};

export const SelectedColumnsDefaultData: SelectedColumnsDefaultData[] = [
  { label: 'iterations', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS },
  { label: 'results.average_cpu', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_CPU },
  { label: 'results.average_memory', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_MEMORY },
  { label: 'results.bytes_throughput', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.THROUGHPUT_BYTES },
  { label: 'results.request_throughput', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.THROUGHPUT_REQUEST },
  { label: 'message_size', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.MESSAGE_SIZE },
];
