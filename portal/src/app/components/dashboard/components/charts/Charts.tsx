/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { NamedExoticComponent } from 'react';
import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import Annotation from 'chartjs-plugin-annotation';
import { pick } from 'lodash';
import { ChartDataMap, ITestResponseData } from '../../../../shared/models/quantum.interface';

import styles from './Charts.module.scss';

export interface ChartsProps {
  data: ChartDataMap;

}
type IChartsData = Pick<ITestResponseData, 'serverMemory' | 'serverCpu' | 'clientMemory' | 'clientCpu'>;

type ChartDataType = Map<string, number[]>;
export const Charts: React.FC<ChartsProps> = (props: ChartsProps) => {
  const { data } = props;
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Annotation);
  const { serverMemoryData, serverCpuData, clientMemoryData, clientCpuData }:
    { serverMemoryData: ChartDataType; serverCpuData: ChartDataType; clientMemoryData: ChartDataType; clientCpuData: ChartDataType; } = BuildData(data);

  return (
    <div className={styles.wrapper}>
      {/* <ChartLine title='Server Memory (%)' data={serverMemoryData} />
      <ChartLine title='Server CPU (%)' data={serverCpuData} />
      <ChartLine title='Client Memory (%)' data={clientMemoryData} />
      <ChartLine title='Client CPU (%)' data={clientCpuData} /> */}
      {/* <ChartLine
        title='Throughput & Goodput (kB)'
        label='Throughput'
        values={ThroughputData}
        lineColor='rgba(0, 87, 184, 1)'
        secondLabel='Goodput'
        secondValues={GoodputData}
        secondLineColor='rgba(145, 220, 0, 1)'
      /> */}

    </div>
  );
};

function getChartsData(data: ITestResponseData): IChartsData {
  data.serverMemory.forEach((item: number) => Number(item.toFixed(2)));
  data.serverCpu.forEach((item: number) => Number(item.toFixed(2)));
  data.clientMemory.forEach((item: number) => Number(item.toFixed(2)));
  data.clientCpu.forEach((item: number) => Number(item.toFixed(2)));

  return pick(data, 'serverMemory', 'serverCpu', 'clientMemory', 'clientCpu');
}
function BuildData(data: ChartDataMap) {
  const clientMemoryData: ChartDataType = new Map<string, number[]>();
  const serverMemoryData: ChartDataType = new Map<string, number[]>();
  const clientCpuData: ChartDataType = new Map<string, number[]>();
  const serverCpuData: ChartDataType = new Map<string, number[]>();

  data.forEach((value, key) => {
    const chartsData: IChartsData = getChartsData(value!);
    clientMemoryData.set(key.label, chartsData.clientMemory);
    serverMemoryData.set(key.label, chartsData.serverMemory);
    clientCpuData.set(key.label, chartsData.clientCpu);
    serverCpuData.set(key.label, chartsData.serverCpu);
  });
  return { serverMemoryData, serverCpuData, clientMemoryData, clientCpuData };
}
export const DashboardMemoized: NamedExoticComponent<ChartsProps> = React.memo<ChartsProps>(Charts);
