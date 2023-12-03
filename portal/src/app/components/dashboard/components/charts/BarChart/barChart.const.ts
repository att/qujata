import { ChartOptions } from 'chart.js';

export const colors: string[] = ['#05BBFF', '#086CE1', '#FF8500', '#36a2eb33'];

export let defaultOptions: ChartOptions<any> = {
    scales: {
        x: {
          display: false, // Hide x-axis labels
        },
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                padding: 40,
            },
        },
        title: {
            display: true,
            text: 'Memory (%)',
        },
    }
};
