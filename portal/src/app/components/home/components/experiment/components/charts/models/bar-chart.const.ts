import { ITestRunResultData } from '../../../../../../../shared/models/test-run-result.interface';
import { CHARTS_EN } from '../translate/en';

type TooltipKeys = keyof ITestRunResultData;
export const tooltipKeys: TooltipKeys[] = ['iterations', 'message_size'];
export const tooltipLabels = ['Iterations', 'Message Size'];

export enum ChartKey {
    average_cpu = 'average_cpu',
    average_memory = 'average_memory',
}

export type ChartTitleDisplayMappingType = { [key in keyof typeof ChartKey]: string; }
export const ChartTitleDisplayMapping: ChartTitleDisplayMappingType = {
  [ChartKey.average_cpu]: `${CHARTS_EN.CHART_TITLES.PREFIX}  ${CHARTS_EN.CHART_TITLES.AVERAGE_CPU}`,
  [ChartKey.average_memory]: `${CHARTS_EN.CHART_TITLES.PREFIX}  ${CHARTS_EN.CHART_TITLES.AVERAGE_MEMORY}`,
} as unknown as ChartTitleDisplayMappingType;
