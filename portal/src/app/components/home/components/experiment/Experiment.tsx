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
import { ExperimentTabs } from './components/experiment-tabs';
import { handleSectionScrolling } from './utils';
import { ISpinner, useSpinnerContext } from '../../../../shared/context/spinner';
import { TableOptions } from './components/table-options';
import { SelectColumnsPopup } from './components/table-options/components/select-columns-popup';
import { SelectedColumnsDefaultData, TableOptionsData } from './components/table-options/constants/table-options.const';
import { convertDataToOptions } from './components/table-options/components/select-columns-popup/utils/convert-data-to-options.utils';
import { AttSelectOption } from '../../../../shared/components/att-select';

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
    const [isSelectColumnsPopupOpen, setSelectColumnsPopupOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState(EXPERIMENT_EN.TABS.RESULTS_DATA);
    const [selectedColumns, setSelectedColumns] = useState<AttSelectOption[]>(SelectedColumnsDefaultData);

    const { isSpinnerOn }: ISpinner = useSpinnerContext();
    const resultsDataRef = useRef<HTMLDivElement>(null);
    const visualizationRef = useRef<HTMLDivElement>(null);
    const tableOptionsRef = useRef<HTMLDivElement>(null);
    const { data } = props;

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
          if (tableOptionsRef.current && !tableOptionsRef.current.contains((event.target as Node))) {
            setSelectColumnsPopupOpen(false);
          }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [tableOptionsRef]);
    
    useEffect(() => {
        handleSectionScrolling(resultsDataRef, visualizationRef, setCurrentSection);
    }, []);

    const handleButtonClick = (section: string) => {
        setCurrentSection(section);

        if (section === EXPERIMENT_EN.TABS.RESULTS_DATA && resultsDataRef.current) {
            resultsDataRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (section === EXPERIMENT_EN.TABS.VISUALIZATION && visualizationRef.current) {
            visualizationRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {isSpinnerOn && renderSpinner()}
            <SubHeader data={data} />
            <div className={styles.tabs_and_options_wrapper}>
                <ExperimentTabs currentSection={currentSection} handleButtonClick={handleButtonClick} />
                <div className={styles.table_options_wrapper} ref={tableOptionsRef}>
                    <TableOptions
                        data={data}
                        handleSelectColumnsClick={() => setSelectColumnsPopupOpen(!isSelectColumnsPopupOpen)}
                        isPopupOpen={isSelectColumnsPopupOpen}
                    />
                        {isSelectColumnsPopupOpen &&
                            <SelectColumnsPopup
                                data={convertDataToOptions(TableOptionsData)}
                                onPopupClose={() => setSelectColumnsPopupOpen(false)}
                                onColumnsSelected={setSelectedColumns}
                                selectedColumns={selectedColumns}
                            />}
                </div>
            </div>
            <div id={EXPERIMENT_EN.TABS.RESULTS_DATA} ref={resultsDataRef}>
                <ExperimentTable data={data} selectedColumns={selectedColumns} />
            </div>
            <div id={EXPERIMENT_EN.TABS.VISUALIZATION} ref={visualizationRef}>
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
