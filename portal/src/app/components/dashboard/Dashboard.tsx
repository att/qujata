/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { max, mean, min, round } from 'lodash';
import React, { NamedExoticComponent } from 'react';
import { ChartDataMap, ITestResponseData, ITimeData } from '../../shared/models/quantum.interface';
import { Charts } from './components/charts';
import { MainBoxes } from './components/main-boxes';

import styles from './Dashboard.module.scss';

export interface DashboardProps {
  data: ChartDataMap;
}

function getTimeData(samples: ITestResponseData): ITimeData {
  if (!samples.totalTime && !samples.connectTime && !samples.downloadSpeed) {
    return {
      totalTime: { min: '0', avg: '0', max: '0' },
      connectTime: { min: '0', avg: '0', max: '0' },
      downloadSpeed: { min: '0', avg: '0', max: '0' },
    };
  }
  const { totalTime: totals, connectTime: connectTimes, downloadSpeed: downloadSpeeds } = samples;

  return {
    totalTime: {
      min: (Number((min(totals) as number) * 1000).toFixed(2)),
      avg: round(mean(totals) * 1000, 2).toString(),
      max: (Number((max(totals) as number) * 1000).toFixed(2)),
    },
    connectTime: {
      min: (Number((min(connectTimes) as number) * 1000).toFixed(2)),
      avg: round(mean(connectTimes) * 1000, 2).toString(),
      max: (Number((max(connectTimes) as number) * 1000).toFixed(2)),
    },
    downloadSpeed: {
      min: (min(downloadSpeeds) as number / 1024).toFixed(2),
      avg: (mean(downloadSpeeds) as number / 1024).toFixed(2),
      max: (max(downloadSpeeds) as number / 1024).toFixed(2),
    },
  };
}
export const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { data } = props;
  const chartDataKeys: string[] = [];
  const chartData: Map<string, ITestResponseData | undefined> = new Map<string, ITestResponseData | undefined>();
  data.forEach((value, key) => {
    chartDataKeys.push(key.label);
    chartData.set(key.label, value);
  });

  return (
    <div className={styles.wrapper}>
      {chartDataKeys.map((key: string) => renderAlgorithmMainBoxes(key, chartData))}
      <Charts data={data} />
    </div>
  );
};

function renderAlgorithmMainBoxes(key:string, chartData: Map<string, ITestResponseData | undefined>) {
  const timeData: ITimeData = getTimeData(chartData.get(key) as ITestResponseData);
  return (
    <MainBoxes title={key} totalTime={timeData.totalTime} connectTime={timeData.connectTime} downloadSpeed={timeData.downloadSpeed} />
  );
}

export const DashboardMemoized: NamedExoticComponent<DashboardProps> = React.memo<DashboardProps>(Dashboard);
