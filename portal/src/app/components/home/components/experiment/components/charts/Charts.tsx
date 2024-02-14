import { IExperimentData } from '../../Experiment';
import styles from './Charts.module.scss';
import { DynamicChart } from './components/dynamic-chart';
import { CHARTS_EN } from './translate/en';

export const Charts: React.FC<IExperimentData> = (props: IExperimentData) => {
    return (
        <div className={styles.charts_wrapper}>
            <div className={styles.title}>{CHARTS_EN.TITLE}</div>
            <DynamicChart chartData={props.data} />
        </div>
    );
}
