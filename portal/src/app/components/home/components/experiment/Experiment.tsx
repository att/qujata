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
import { ExternalLink, LinkRel, LinkSize, LinkStyle, LinkTarget } from '../../../../shared/components/att-link';
import { Environment } from '../../../../../environments/environment';
import { DashBoardPrefixLink } from '../../../../shared/constants/dashboard';
import { initialLink } from './constant/experiment.const';
import EyeSvg from '../../../../../assets/images/eye.svg';

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
    const [grafanaLink, setGrafanaLink] = useState<string>(initialLink);

    const { isSpinnerOn }: ISpinner = useSpinnerContext();
    const resultsDataRef = useRef<HTMLDivElement>(null);
    const visualizationRef = useRef<HTMLDivElement>(null);
    const tableOptionsRef = useRef<HTMLDivElement>(null);
    const { data } = props;

    useEffect(() => {
        if (data) {
            const dashboardLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${data.start_time}&to=${data.end_time}`;
            setGrafanaLink(dashboardLink);
        }
    }, [data]);

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
            <div className={styles.toggles_and_options_wrapper}>
                <ExperimentTabs currentSection={currentSection} handleButtonClick={handleButtonClick} />
                <ExternalLink
                    className={styles.link_wrapper}
                    link={grafanaLink}
                    styleType={LinkStyle.TEXT}
                    size={LinkSize.NONE}
                    target={LinkTarget.BLANK}
                    rel={LinkRel.NO_OPENER}
                >
                    <div className={styles.grafana_link}>
                        <img className={styles.eye_icon} src={EyeSvg} alt="eye" />
                        {EXPERIMENT_EN.LINK_TO_GRAFANA}
                    </div>
                </ExternalLink>
                <div className={styles.table_options_wrapper} ref={tableOptionsRef}>
                    <TableOptions
                        handleSelectColumnsClick={() => setSelectColumnsPopupOpen(!isSelectColumnsPopupOpen)}
                        isPopupOpen={isSelectColumnsPopupOpen}
                    />
                        {isSelectColumnsPopupOpen &&
                            <SelectColumnsPopup
                                data={convertDataToOptions(TableOptionsData)}
                                onPopupClose={() => setSelectColumnsPopupOpen(false)}
                                onColumnsSelected={setSelectedColumns}
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
