/* eslint-disable max-len */
import { ChartOptions } from 'chart.js';

export const ThroughputData: number[] = [77, 66, 77, 50, 58, 53, 55, 61, 61, 53, 67, 61, 45, 77, 53, 50, 40, 71, 68, 46, 53, 66, 64, 51, 75, 58, 65, 73, 76, 71, 52, 75, 58, 68, 79, 69, 69, 43, 45, 43, 49, 46, 63, 48, 78, 47, 78, 50, 61, 52, 61, 59, 46, 75, 40, 56, 70, 47, 41, 73, 62, 73, 67, 58, 78, 43, 62, 47, 58, 52, 40, 46, 59, 41, 59, 73, 46, 57, 63, 66, 50, 63, 61, 57, 63, 45, 74, 63, 60, 67, 58, 49, 77, 41, 56, 41, 49, 63, 57, 64, 42, 56, 58, 53, 46, 75, 54, 72, 76, 70, 79, 60, 47, 77, 46, 47, 44, 69, 74, 71, 55, 60, 69, 61, 43, 62, 64, 42, 65, 46, 52, 67, 59, 60, 66, 41, 66, 45, 75, 53, 78, 53, 56, 53, 69, 76, 63, 60, 62, 72];
export const GoodputData: number[] = [57, 50, 66, 32, 52, 33, 43, 59, 47, 53, 52, 50, 22, 54, 31, 30, 39, 69, 47, 31, 45, 63, 55, 29, 69, 34, 58, 58, 75, 63, 29, 74, 34, 57, 68, 52, 64, 32, 41, 21, 36, 42, 48, 26, 68, 44, 71, 43, 43, 35, 38, 50, 44, 51, 16, 42, 56, 24, 38, 63, 48, 49, 57, 49, 77, 20, 54, 47, 40, 39, 29, 36, 55, 29, 43, 68, 35, 50, 51, 48, 40, 43, 45, 52, 44, 31, 56, 59, 36, 60, 38, 29, 56, 37, 48, 33, 32, 60, 52, 49, 34, 46, 53, 31, 37, 67, 31, 53, 61, 56, 63, 50, 37, 71, 33, 26, 42, 69, 52, 67, 44, 56, 49, 60, 29, 41, 47, 36, 51, 33, 35, 47, 45, 44, 63, 27, 65, 23, 70, 34, 72, 37, 43, 50, 56, 52, 41, 41, 51, 57];

export const ChartOption: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
  },
  hover: {
    mode: 'nearest',
    intersect: true,
  },
};

export const ChartLineColors: string[] = ['rgba(255, 176, 0, 1)', 'rgba(145, 220, 0, 1', 'rgba(0, 159, 219, 1)', 'rgba(175, 41, 187, 1)', 'rgba(72, 238, 220, 1)'];
