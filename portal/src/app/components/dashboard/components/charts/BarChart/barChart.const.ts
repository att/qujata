import { ChartOptions } from 'chart.js';
import { CHARTS_EN } from '../../../../home/components/experiment/components/charts/translate/en';

export const colors: string[] = ['#086CE1', '#FF8500', '#05BBFF', '#6D3FFC', '#E2180B', '#8208E1', '#08E145', '#9AB2C9', '#EB00FF', '#FFC700', '#8F5C47', '#05FFFF', '#FA9BF7'];

export let defaultOptions: ChartOptions<any> = {
    responsive: true,
    aspectRatio: 2, // The chart will have a width:height ratio of 2:1
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
            ticks: {
              stepSize: 2,
              font: {
                size: 14,
              },
            },
        },
    },
    plugins: {
        legend: {
            align: 'start',
            position: 'bottom',
            labels: {
                font: {
                    size: 16,
                },
            },
        },
    }
};

export const TITLE_PREFIX = 'Server Memory (%) vs.';
