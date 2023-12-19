import { ChartOptions } from 'chart.js';

export const colors: string[] = ['#05BBFF', '#086CE1', '#FF8500', '#36a2eb33'];

export let defaultOptions: ChartOptions<any> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
};
