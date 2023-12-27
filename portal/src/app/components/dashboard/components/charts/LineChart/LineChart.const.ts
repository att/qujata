import { ChartOptions } from 'chart.js';
import { CHARTS_EN } from '../../../../home/components/experiment/components/charts/translate/en';

export const colors: string[] = ['#05BBFF', '#086CE1', '#FF8500', '#36a2eb33'];

export let defaultOptions: ChartOptions<any> = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: CHARTS_EN.Y_AXIS_TITLE,
          font: {
              size: 14,
          },
          padding: { bottom: 10 },
        },
        beginAtZero: true,
        ticks: {
          stepSize: 2,
          font: {
            size: 14,
          },
        },
      },
    },
};

export const TITLE_PREFIX = 'Server Memory (%) vs.';
