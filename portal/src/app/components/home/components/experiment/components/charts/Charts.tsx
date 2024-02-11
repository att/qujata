import { IExperimentData } from '../../Experiment';
import styles from './Charts.module.scss';
import { DynamicChart } from './components/dynamic-chart';

export const Charts: React.FC<IExperimentData> = (props: IExperimentData) => {
    return (
        <div className={styles.charts_wrapper}>
            <DynamicChart chartData={props.data} />
        </div>
    );
}
