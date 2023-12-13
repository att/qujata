import { BarChart } from '../../../../../dashboard/components/charts/BarChart';
import styles from './Charts.module.scss';
import { useChartsData } from './hooks/useChartsData';
import { tooltipKeys, tooltipLabels } from './models/bar-chart.const';
import { CHARTS_EN } from './translate/en';
import { getChartTitleByType } from './utils/chart.utils';

export const Charts: React.FC = () => {
    const {data, labels, keysOfData} = useChartsData();

    return (
        <div className={styles.charts_wrapper}>
          <div className={styles.title}>{CHARTS_EN.TITLE}</div>
          <div className={styles.chart_wrapper}>
            {keysOfData.map((key) => (
                <BarChart key={key} title={getChartTitleByType(key)} labels={labels} data={data} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} keyOfData={key} />
            ))}
          </div>
        </div>
    );
}
