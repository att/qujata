import { ITestRunResultData } from '../../../../../../../shared/models/test-run-result.interface';
import { CHARTS_EN } from '../translate/en';

type TooltipKeys = keyof ITestRunResultData;
export const tooltipKeys: TooltipKeys[] = ['iterations', 'message_size'];
export const tooltipLabels = ['Iterations', 'Message Size'];

export enum ChartKey {
    averageCPU = 'averageCPU',
    averageMemory = 'averageMemory',
}

export type ChartTitleDisplayMappingType = { [key in keyof typeof ChartKey]: string; }
export const ChartTitleDisplayMapping: ChartTitleDisplayMappingType = {
  [ChartKey.averageCPU]: `${CHARTS_EN.CHART_TITLES.PREFIX}  ${CHARTS_EN.CHART_TITLES.AVERAGE_CPU}`,
  [ChartKey.averageMemory]: `${CHARTS_EN.CHART_TITLES.PREFIX}  ${CHARTS_EN.CHART_TITLES.AVERAGE_MEMORY}`,
} as unknown as ChartTitleDisplayMappingType;
