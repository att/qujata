import { ExperimentTable } from './components/experiment-table';
import styles from './Experiment.module.scss';
import { Charts } from './components/charts';
import { SubHeader } from './components/sub-header';
import { useExperimentData } from './components/hooks/useExperimentData';
import { ITestRunResult } from '../../../../shared/models/test-run-result.interface';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';
import { Spinner, SpinnerSize } from '../../../../shared/components/att-spinner';

export type IExperimentData = {
  data: ITestRunResult;
}

export const Experiment: React.FC = () => {
  const { data: testRunData, status } = useExperimentData();

  return (
      <div className={styles.experiment_wrapper}>
        {status === FetchDataStatus.Fetching ? renderSpinner() : testRunData && <ExperimentContent data={testRunData} />}
      </div>
  );
}

interface ExperimentContentProps {
    data: ITestRunResult;
}
const ExperimentContent: React.FC<ExperimentContentProps> = (props: ExperimentContentProps) => {
    const { data } = props;
    return (
        <>
            <SubHeader data={data} />
            <ExperimentTable data={data} />
            <Charts data={data} />
        </>
    );
}

function renderSpinner() {
    return (
        <div className={styles.spinner_overlay}>
            <div className={styles.spinner_wrapper}>
            <Spinner size={SpinnerSize.MEDIUM} />
            </div>
        </div>
    );
}
