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
import { ISpinner, useSpinnerContext } from '../../../../shared/context/spinner';
import { TableOptions } from './components/table-options';
import { SelectColumnsPopup } from './components/table-options/components/select-columns-popup';
import { TableOptionsData } from './components/table-options/constants/table-options.const';
import { convertDataToOptions } from './components/table-options/components/select-columns-popup/utils/convert-data-to-options.utils';

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

export const ExperimentContent: React.FC<IExperimentData> = (props: IExperimentData) => {
    const [currentSection, setCurrentSection] = useState(EXPERIMENT_EN.TITLES.RESULTS_DATA);
    const [isSelectColumnsPopupOpen, setSelectColumnsPopupOpen] = useState(false);
    const { isSpinnerOn }: ISpinner = useSpinnerContext();
    const resultsDataRef = useRef<HTMLDivElement>(null);
    const visualizationRef = useRef<HTMLDivElement>(null);
    const tableOptionsRef = useRef<HTMLDivElement>(null);
    const { data } = props;

    useEffect(() => {
        function handleClickOutside(event: any) {
          if (tableOptionsRef.current && !tableOptionsRef.current.contains(event.target)) {
            setSelectColumnsPopupOpen(false);
          }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [tableOptionsRef]);
    
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

    const handleSelectColumnsClick = () => {
        setSelectColumnsPopupOpen(!isSelectColumnsPopupOpen);
    };

    return (
        <>
            {isSpinnerOn && renderSpinner()}
            <SubHeader data={data} />
            <div className={styles.toggles_and_options_wrapper}>
                <Toggles currentSection={currentSection} handleButtonClick={handleButtonClick} />
                <div className={styles.table_options_wrapper} ref={tableOptionsRef}>
                <TableOptions handleSelectColumnsClick={handleSelectColumnsClick} isPopupOpen={isSelectColumnsPopupOpen} />
                    {isSelectColumnsPopupOpen &&
                        <SelectColumnsPopup
                            data={convertDataToOptions(TableOptionsData)}
                            isSelected={true}
                            onPopupClose={() => setSelectColumnsPopupOpen(false)}
                        />}
                </div>
            </div>
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
