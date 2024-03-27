import { Line } from 'react-chartjs-2';
import { ChartOptions, Chart, TooltipItem } from 'chart.js';
import { TITLE_PREFIX } from './LineChart.const';
import { useRef } from 'react';

export interface LineChartProps {
    data: any;
    tooltipLabel?: string;
    titleX?: string;
    titleY?: string;
    xAxiosTitle?: string;
}

export const LineChart: React.FC<LineChartProps> = (props: LineChartProps) => {
    const { data, titleX, titleY, tooltipLabel, xAxiosTitle } = props;
    const chartRef = useRef<Chart<"line", number[], unknown>>(null);

    const options: ChartOptions<any> = {
      responsive: true,
      aspectRatio: 2,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: titleX ? titleX.replace(TITLE_PREFIX, '').trim() : '',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: titleY ? titleY.replace(TITLE_PREFIX, '').trim() : '',
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
      plugins: {
        title: {
          display: true,
          text: xAxiosTitle,
          align: 'start',
          font: {
            size: 18,
            weight: '500',
          },
          padding: {
            bottom: 30,
          },
        },
        legend: {
          position: 'bottom',
          align: 'start',
          labels: {
              font: {
                size: 16,
              },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(243, 244, 246, 1)',
          titleColor: '#1D2329',
          padding: 10,
          bodyColor: '#1D2329',
          displayColors: false,
          callbacks: {
            title: function (context: TooltipItem<'line'>[]) {
              return generateTooltipTitle(context[0]);
            },
            label: function (context: TooltipItem<'line'>) {
              return renderTooltipLabel(context, tooltipLabel || '');
            },
          },
        },
      }
    };

    return  (
      <div
        onMouseMove={(event) => {
          const elements = chartRef.current?.getElementsAtEventForMode(
            event.nativeEvent,
            'nearest',
            { intersect: true },
            false
          );

          if (elements && elements.length) {
            event.currentTarget.style.cursor = 'pointer';
          } else {
            event.currentTarget.style.cursor = 'default';
          }
        }}
        onMouseOut={(event) => {
          (event.currentTarget as HTMLElement).style.cursor = 'default';
        }}
      >
        <Line ref={chartRef} data={data} options={options} style={{ blockSize: '450px' }} />
      </div>
    );
}

export function generateTooltipTitle(tooltipItem: TooltipItem<'line'>) {
  return tooltipItem?.dataset?.label;
}

export function renderTooltipLabel(context: TooltipItem<'line'>, tooltipLabel: string): string {  
  return `${tooltipLabel} ${context?.raw?.toString()}` || '';
}
