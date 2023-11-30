import { Chart, registerables, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { colors } from './barChart.const';

let options: ChartOptions<any> = {
    scales: {
        x: {
          display: false, // Hide x-axis labels
        },
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Memory (%)',
        },
    }
};
export interface BarChartProps {
    labels: string[];
    data: any;
    tooltipKeys: string[];
    tooltipLabels: string[];
}
export const BarChart: React.FC<BarChartProps> = (props: BarChartProps) => {
    const { labels, data, tooltipKeys, tooltipLabels } = props;
    const [dataValues, setDataValues] = useState();
    const [datasets, setDatasets] = useState([]);
    
    Chart.register(...registerables); // initial chart.js

    useEffect(() => {
        const temp = data.map((obj: any) => obj.results.averageCPU);
        setDataValues(temp);
    }, [data]);

    useEffect(() => {
        if (dataValues) {
            const tempValues: any = labels.map((label, i) => ({
                    label: label,
                    data: [dataValues[i]],
                    backgroundColor: colors[i % colors.length],
                    borderWidth: 0,
                }));
            setDatasets(tempValues);
        }
    }, [dataValues, labels]);

    options = {
        ...options,
        plugins: {
          tooltip: {
            displayColors: false,
            callbacks: {
              title: function (context: any) {
                const index = context[0].datasetIndex;
                return labels[index];
              },
              label: function (context: any) {
                const index = context.datasetIndex;
                const valByKey = dataValues && dataValues[index];
                const label1: string = tooltipKeys[0];
                const label2: string = tooltipKeys[1];
                const val1 = data[index][label1];
                const val2 = data[index][label2];
                return `${valByKey} (${tooltipLabels[0]}: ${val1}, ${tooltipLabels[1]}: ${val2})`;
              },
            },
          },
        },
    };

    const temp = {
        labels: labels,
        datasets: datasets,
    };

    return (
        <Bar data={temp as any} options={options} />
    );
}