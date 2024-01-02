import { ChartData, ChartOptions, ChartType, TooltipItem, Chart, LegendItem, ChartDataset } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import { IDatasets } from './models/BarChart.model';
import { TITLE_PREFIX, colors, defaultOptions } from './barChart.const';
import styles from './BarChart.module.scss';
import { uniq } from 'lodash';

export interface BarChartProps {
    labels: string[];
    data: any;
    keyOfData: string;
    tooltipKeys: string[];
    tooltipLabels: string[];   
    title?: string;
}

export const BarChart: React.FC<BarChartProps> = (props: BarChartProps) => {
    const { labels, data, tooltipKeys, tooltipLabels, keyOfData, title } = props;
    const [dataValues, setDataValues] = useState();
    const [datasets, setDatasets] = useState<IDatasets[]>([]);
    const [algorithmsColors, setAlgorithmsColors] = useState<{[key: string]: string}>();
    const chartRef = useRef<Chart<ChartType, ChartData<ChartType>, unknown>>(null);

    useEffect(() => {
        const temp = data.map((obj: any) => obj.results[keyOfData]);
        setDataValues(temp);

        const algorithms: string[] = uniq(data.map((item: any) => item.algorithm));
        const algorithmColors: {[key: string]: string} = {};
        algorithms.forEach((algorithm, index) => {
          algorithmColors[algorithm] = colors[index % colors.length];
        });
        setAlgorithmsColors(algorithmColors);
    }, [data, keyOfData]);

    useEffect(() => {
        if (dataValues) {
            const tempValues: IDatasets[] = labels.map((label, i) => ({
                    label: label,
                    data: [dataValues[i]],
                    backgroundColor: getBackgroundColorByAlgorithm(data[i].algorithm, algorithmsColors),
                    borderWidth: 0,
                }));
            setDatasets(tempValues);
        }
    }, [algorithmsColors, data, dataValues, labels]);

    const options: ChartOptions<any> = {
        ...defaultOptions,
        scales: {
          ...defaultOptions.scales,
          x: {
            display: true,
            title: {
              display: true,
              text: title ? title.replace(TITLE_PREFIX, '').trim() : '',
              padding: { bottom: 30, top: 10 },
            },
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          ...defaultOptions.plugins,
          legend: {
            ...defaultOptions.plugins?.legend,
            labels: {
              ...defaultOptions.plugins?.legend?.labels,
              filter: function(item: LegendItem, chart: ChartData) {
                const firstIndex = chart?.datasets.findIndex((dataset: ChartDataset) => dataset.label === item.text);
                if (item.datasetIndex !== firstIndex) {
                  return false;
                }

                return true;
              },
            }
          },
          title: {
            display: true,
            text: title,
            align: 'start',
            font: {
              size: 18,
              weight: '500',
            },
            padding: {
              bottom: 30,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(243, 244, 246, 1)',
            titleColor: '#1D2329',
            padding: 10,
            bodyColor: '#1D2329',
            displayColors: false,
            callbacks: {
              title: function (context: TooltipItem<'bar'>[]) {
                const index = context[0].datasetIndex;
                return generateTooltipTitle(labels, index);
              },
              label: function (context: TooltipItem<'bar'>) {
                return renderTooltipLabel(context, dataValues, tooltipKeys, tooltipLabels, data);
              },
            },
          },
        },
    };

    const tempData: {labels: string[], datasets: IDatasets[]} = {
        labels: labels,
        datasets: datasets,
    };

    return (
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
        onMouseOut={(event: React.MouseEvent) => {
          (event.currentTarget as HTMLElement).style.cursor = 'default';
        }}
      >
        <Bar ref={chartRef as any} data={tempData} options={options} style={{ height: '450px' }} className={styles.bar} />
      </div>
    );
}

export function renderTooltipLabel(context: { datasetIndex : number }, dataValues: any, tooltipKeys: string[], tooltipLabels: string[], data: any): string {  
  const index = context.datasetIndex;
    const valByKey = dataValues && dataValues[index];
    const label1: string = tooltipKeys[0];
    const label2: string = tooltipKeys[1];
    const val1 = data[index][label1];
    const val2 = data[index][label2];
    return `${valByKey} (${tooltipLabels[0]}: ${val1}, ${tooltipLabels[1]}: ${val2})`;
}

export function generateTooltipTitle(labels: string[], index: number): string {
  return labels[index];
}

function getBackgroundColorByAlgorithm(algorithm: string, algorithmColors: any): string {
  return algorithmColors[algorithm];
}
