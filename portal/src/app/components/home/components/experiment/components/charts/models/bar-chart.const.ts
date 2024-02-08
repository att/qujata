import { CHARTS_EN } from '../translate/en';

export const tooltipKeys = ['algorithm', 'iterations'];
export const tooltipLabels = ['Algorithm', 'Iterations'];

export enum ChartKey {
    average_cpu = 'average_cpu',
    averageMemory = 'averageMemory',
}

export type ChartTitleDisplayMappingType = { [key in keyof typeof ChartKey]: string; }
export const ChartTitleDisplayMapping: ChartTitleDisplayMappingType = {
  [ChartKey.average_cpu]: `${CHARTS_EN.CHART_TITLES.PREFIX}  ${CHARTS_EN.CHART_TITLES.AVERAGE_CPU}`,
  [ChartKey.averageMemory]: `${CHARTS_EN.CHART_TITLES.PREFIX}  ${CHARTS_EN.CHART_TITLES.AVERAGE_MEMORY}`,
} as unknown as ChartTitleDisplayMappingType;
