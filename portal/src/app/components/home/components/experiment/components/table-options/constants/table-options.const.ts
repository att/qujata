import { EXPERIMENT_TABLE_EN } from '../../experiment-table/translate/en';
import { Environment } from "../../../../../../../../environments/environment";
import { DashBoardPrefixLink } from "../../../../../../../shared/constants/dashboard";

const generateFromTime: number = Date.now();
export const initialLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${generateFromTime}`;

export const TableOptionsData = {
  options: [
    EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_CPU,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_MEMORY,
  ]
};

export const SelectedColumnsDefaultData = [
  { label: 'iterations', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS },
  { label: 'results.averageCPU', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_CPU },
  { label: 'results.averageMemory', value: EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_MEMORY }
];
