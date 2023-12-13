import styles from './Experiment.module.scss';
import { Charts } from './components/charts';
import { SubHeader } from './components/sub-header';

export const Experiment: React.FC = () => {
    return (
        <div className={styles.experiment_wrapper}>
          <SubHeader linkTitle='Experiment Name' />
          <Charts />
        </div>
    );
}

