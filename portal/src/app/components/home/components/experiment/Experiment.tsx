import { ExperimentTable } from './components/experiment-table';
import styles from './Experiment.module.scss';
import { Charts } from './components/charts';
import { SubHeader } from './components/sub-header';
import { useExperimentData } from './components/hooks/useExperimentData';
import { ITestRunResult } from '../../../../shared/models/test-run-result.interface';

export type IExperimentData = {
  data: ITestRunResult;
}

export const Experiment: React.FC = () => {
  const { data: testRunData } = useExperimentData();

  return (
      <div className={styles.experiment_wrapper}>
        <SubHeader linkTitle='Experiment Name' />
        <ExperimentTable data={testRunData} />
        <Charts data={testRunData} />
      </div>
  );
}

