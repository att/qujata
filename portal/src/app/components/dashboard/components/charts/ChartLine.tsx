/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChartData, ChartOptions } from 'chart.js';
import React, { } from 'react';
import { Line } from 'react-chartjs-2';

import styles from './ChartLine.module.scss';
import { ChartLineColors, ChartOption } from './Charts.const';

export interface ChartLineProps {
  title: string;
  data: Map<string, number[]>
}

export const ChartLine: React.FC<ChartLineProps> = (props: ChartLineProps) => {
  const { title: name, data: linesData } = props;
  const datasets: { label: string, data: number[], fill: boolean, borderColor: string }[] = [];
  let lineIndex:number = 0;
  linesData.forEach((value, key) => {
    datasets.push({ label: key, data: value, fill: true, borderColor: ChartLineColors[lineIndex] });
    lineIndex += 1;
  });

  const config: ChartOptions<'line'> = {
    ...ChartOption,
    plugins: {
      ...ChartOption.plugins, legend: { position: 'top', display: true },
    },
  };

  const data: ChartData<'line'> = { labels: Array.from(Array(datasets[0].data.length).keys()), datasets };

  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{name}</div>
      <Line data={data} options={config} />
    </div>
  );
};
