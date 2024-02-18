import { AttSelectOption } from '../../../../../../shared/components/att-select';
import { IExperimentData } from '../../Experiment';
import styles from './Charts.module.scss';
import { DynamicChart } from './components/dynamic-chart';
import { useDynamicChartData } from './components/dynamic-chart/hooks/useDynamicChartData';
import { ChartType, chartTypeOptions, xAxisTypeOptions } from './components/dynamic-chart/models/dynamic-chart.interface';
import { CHARTS_EN } from './translate/en';

export const Charts: React.FC<IExperimentData> = (props: IExperimentData) => {
    const { yAxiosOptions } = useDynamicChartData(props.data);
    const xDefaultOption: AttSelectOption = xAxisTypeOptions[0];
    return (
        <div className={styles.charts_content}>
            <div className={styles.title}>{CHARTS_EN.TITLE}</div>
            <div className={styles.charts_wrapper}>
                {
                    yAxiosOptions?.map((item, index) => (
                        <div className={styles.chart}>
                                                    <DynamicChart chartData={props.data} xDefaultOption={xDefaultOption} yDefaultOption={item} chartDefaultType={getChartDefaultTypeByValue(item.value) as AttSelectOption} />

                        </div>
                    ))
                }
            </div>
        </div>
    );
}

function getChartDefaultTypeByValue(yValue: string): AttSelectOption | undefined {
    const chartType = (yValue === 'average_cpu' || yValue === 'average_memory') ? ChartType.BAR : ChartType.LINE;
    return chartTypeOptions.find(option => option.value === chartType);
}
