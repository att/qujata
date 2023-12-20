import { ChartOptions } from 'chart.js';

export const colors: string[] = ['#086CE1', '#FF8500', '#05BBFF', '#6D3FFC'];

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
                padding: 16,
            },
        },
    }
};
