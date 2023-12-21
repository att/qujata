import { ExperimentTable } from './components/experiment-table';
import styles from './Experiment.module.scss';
import { Charts } from './components/charts';
import { SubHeader } from './components/sub-header';
import { useExperimentData } from './components/hooks/useExperimentData';
import { ITestRunResult } from '../../../../shared/models/test-run-result.interface';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';
import { Spinner, SpinnerSize } from '../../../../shared/components/att-spinner';
import { useEffect, useRef, useState } from 'react';
import { EXPERIMENT_EN } from './translate/en';
import { Toggles } from './components/toggles';
import { handleSectionScrolling } from './utils';

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

const ExperimentContent: React.FC<IExperimentData> = (props: IExperimentData) => {
    const [currentSection, setCurrentSection] = useState(EXPERIMENT_EN.TITLES.RESULTS_DATA);
    const { data } = props;
    const resultsDataRef = useRef<HTMLDivElement>(null);
    const visualizationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        handleSectionScrolling(resultsDataRef, visualizationRef, setCurrentSection);
    }, []);

    const handleButtonClick = (section: string) => {
        setCurrentSection(section);

        if (section === EXPERIMENT_EN.TITLES.RESULTS_DATA && resultsDataRef.current) {
            resultsDataRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (section === EXPERIMENT_EN.TITLES.VISUALIZATION && visualizationRef.current) {
            visualizationRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <SubHeader data={data} />
            <Toggles currentSection={currentSection} handleButtonClick={handleButtonClick} />
            <div id={EXPERIMENT_EN.TITLES.RESULTS_DATA} ref={resultsDataRef}>
                <ExperimentTable data={data} />
            </div>
            <div id={EXPERIMENT_EN.TITLES.VISUALIZATION} ref={visualizationRef}>
                <Charts data={data} />
            </div>
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
