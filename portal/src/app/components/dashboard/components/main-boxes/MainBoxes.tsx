/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { NamedExoticComponent, ReactNode } from 'react';
import { ITimeDataItem } from '../../../../shared/models/quantum.interface';

import styles from './MainBoxes.module.scss';

export interface MainBoxesProps {
  title: string
  totalTime: ITimeDataItem;
  connectTime: ITimeDataItem;
  downloadSpeed: ITimeDataItem;
}

export const MainBoxes: React.FC<MainBoxesProps> = (props: MainBoxesProps) => {
  const { totalTime, connectTime, downloadSpeed, title } = props;

  return (
    <div>
      <h3>{title}</h3>
      <div className={styles.wrapper}>
        {renderMainBox('Session Time - Avg (mSec)', totalTime)}
        {renderMainBox('Session Handshake Time - Avg (mSec)', connectTime)}
        {renderMainBox('Download Speed - Avg (kB/sec)', downloadSpeed)}
      </div>
    </div>

  );

  function renderMainBox(boxTitle: string, timeData: ITimeDataItem): ReactNode {
    return (
      <div className={styles.main_box_wrapper}>
        <div className={styles.main_box_title}>{boxTitle}</div>
        <div className={styles.main_box_value}>{timeData.avg}</div>
        <div className={styles.main_box_minmax}> <span> min: {timeData.min}&nbsp;&nbsp;max: {timeData.max}</span> </div>
      </div>
    );
  }
};

export const DashboardMemoized: NamedExoticComponent<MainBoxesProps> = React.memo<MainBoxesProps>(MainBoxes);
