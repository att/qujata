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
  ]
};

export const SelectedColumnsDefaultData: SelectedColumnsDefaultData[] = [
  { label: 'iterations', value: TableOptionsData.options[0] },
  { label: 'message_size', value: TableOptionsData.options[1] },
  { label: 'results.averageCPU', value: TableOptionsData.options[2] },
  { label: 'results.averageMemory', value: TableOptionsData.options[3] }
];
