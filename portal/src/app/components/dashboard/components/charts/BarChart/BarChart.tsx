import { Chart, registerables, ChartOptions, TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { colors, defaultOptions } from './BarChart.const';
import { IDatasets } from './models/BarChart.model';

export interface BarChartProps {
    labels: string[];
    data: any;
    title: string;
    keyOfData: string;
    tooltipKeys: string[];
    tooltipLabels: string[];   
}
export const BarChart: React.FC<BarChartProps> = (props: BarChartProps) => {
    const { labels, data, tooltipKeys, tooltipLabels, keyOfData, title } = props;
    const [dataValues, setDataValues] = useState();
    const [datasets, setDatasets] = useState<IDatasets[]>([]);
    
    Chart.register(...registerables); // initial chart.js

    useEffect(() => {
        const temp = data.map((obj: any) => obj.results[keyOfData]);
        setDataValues(temp);
    }, [data, keyOfData]);

    useEffect(() => {
        if (dataValues) {
            const tempValues: IDatasets[] = labels.map((label, i) => ({
                    label: label,
                    data: [dataValues[i]],
                    backgroundColor: colors[i % colors.length],
                    borderWidth: 0,
                }));
            setDatasets(tempValues);
        }
    }, [dataValues, labels]);

    const options: ChartOptions<any> = {
        ...defaultOptions,
        plugins: {
          ...defaultOptions.plugins,
          title: {
            display: true,
            text: title,
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: function (context: TooltipItem<'bar'>[]) {
                const index = context[0].datasetIndex;
                return labels[index];
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
        <Bar data={tempData} options={options} />
    );
}

function renderTooltipLabel(context: TooltipItem<'bar'>, dataValues: any, tooltipKeys: string[], tooltipLabels: string[], data: any): string {
    const index = context.datasetIndex;
    const valByKey = dataValues && dataValues[index];
    const label1: string = tooltipKeys[0];
    const label2: string = tooltipKeys[1];
    const val1 = data[index][label1];
    const val2 = data[index][label2];
    return `${valByKey} (${tooltipLabels[0]}: ${val1}, ${tooltipLabels[1]}: ${val2})`;
}
