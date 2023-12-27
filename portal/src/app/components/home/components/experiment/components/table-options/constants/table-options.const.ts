import { EXPERIMENT_TABLE_EN } from '../../experiment-table/translate/en';

export const TableOptionsData = {
  options: [
    EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_CPU,
    EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_MEMORY,
  ]
};

export const SelectedColumnsDefaultData = [
  { value: 'iterations', label: EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS },
  { value: 'results.averageCPU', label: EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_CPU },
  { value: 'results.averageMemory', label: EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_MEMORY }
];
