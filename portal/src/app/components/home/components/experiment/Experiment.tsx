import styles from './Experiment.module.scss';
import { SubHeader } from './components/sub-header';

export const Experiment: React.FC = () => {
    return (
        <div className={styles.experiment_wrapper}>
          <SubHeader />
        </div>
    );
}

