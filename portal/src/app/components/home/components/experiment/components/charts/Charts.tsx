/* eslint-disable no-null/no-null */
import { BarChart } from '../../../../../dashboard/components/charts/BarChart';
import { LineChart } from '../../../../../dashboard/components/charts/LineChart';
import styles from './Charts.module.scss';
import { useChartsData } from './hooks/useChartsData';
import { tooltipKeys, tooltipLabels } from './models/bar-chart.const';
import { CHARTS_EN } from './translate/en';
import { getChartTitleByType } from './utils/chart.utils';

export const Charts: React.FC = () => {
    const {barChartData, barChartLabels, barChartKeysOfData, lineChartData} = useChartsData();

    return (
        <div className={styles.charts_wrapper}>
          <div className={styles.title}>{CHARTS_EN.TITLE}</div>
          <div className={styles.chart_wrapper}>
            {barChartKeysOfData.map((key) => (
                <BarChart key={key} title={getChartTitleByType(key)} labels={barChartLabels} data={barChartData} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} keyOfData={key} />
            ))}

            {barChartKeysOfData.map((key) => {
                    const datasets = lineChartData.datasets
                    .filter(dataset => dataset.data[key])
                    .map(dataset => ({
                        ...dataset,
                        data: dataset.data[key]
                    }));

                    if (datasets.length === 0) return null;

                    const data = {
                    labels: lineChartData.labels,
                    datasets: datasets
                    };

                    return (
                        <LineChart key={key} data={data} title={getChartTitleByType(key)} tooltipLabel={getChartTitleByType(key)} />
                    );
                })}
          </div>
        </div>
    );
}