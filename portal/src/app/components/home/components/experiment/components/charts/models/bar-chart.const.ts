import { CHARTS_EN } from "../translate/en";

export const barChartTooltipKeys = ['messageSizeBytes', 'iterations'];
export const barChartTooltipLabels = ['Message Size', 'Iterations'];

export enum ChartKey {
    averageCPU = 'averageCPU',
    averageMemory = 'averageMemory',
    errorRate = 'errorRate',
    bytesThroughput = 'bytesThroughput',
    messagesThroughput = 'messagesThroughput',
    averageTLSHandshakeTime = 'averageTLSHandshakeTime',
}

export type ChartTitleDisplayMappingType = { [key in keyof typeof ChartKey]: string; }
export const ChartTitleDisplayMapping: ChartTitleDisplayMappingType = {
  [ChartKey.averageCPU]: CHARTS_EN.CHART_TITLES.AVERAGE_CPU,
  [ChartKey.averageMemory]: CHARTS_EN.CHART_TITLES.AVERAGE_MEMORY,
  [ChartKey.errorRate]: CHARTS_EN.CHART_TITLES.ERROR_RATE,
  [ChartKey.bytesThroughput]: CHARTS_EN.CHART_TITLES.BYTES_THROUGHPUT,
  [ChartKey.messagesThroughput]: CHARTS_EN.CHART_TITLES.MESSAGES_THROUGHPUT,
  [ChartKey.averageTLSHandshakeTime]: CHARTS_EN.CHART_TITLES.AVERAGE_TLS_HANDSHAKE_TIME,
} as unknown as ChartTitleDisplayMappingType;
