import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { colors, defaultOptions } from './LineChart.const';
import { useEffect, useState } from 'react';
import { IData } from './models/LineChart.model';

export interface LineChartProps {
    data: any;
    title?: string;
}
const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        yAxisID: 'y-axis-1',
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27],
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        yAxisID: 'y-axis-2',
      },
    ],
  };
export const LineChart: React.FC<LineChartProps> = (props: LineChartProps) => {
    const { data, title } = props;
    const [datasets, setDatasets] = useState<IData[]>([]);
    console.log('datasets', datasets);
    useEffect(() => {
        const tempValues: IData[] = data.datasets.map((item: IData, i: number) => ({
            ...item,
            fill: false,
            backgroundColor: colors[i % colors.length],
            borderColor: colors[i % colors.length],
            yAxisID: `y-axis-${i}`,
        }));
        setDatasets(tempValues);
    }, [data]);

    const options: ChartOptions<any> = {
        ...defaultOptions,
        plugins: {
            title: {
              display: true,
              text: title
            },
        }
    };

    const tempData: {labels: string[], datasets: IData[]} = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: datasets,
    }
    return <Line data={tempData} options={options} />;
}
