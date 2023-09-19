/* eslint-disable jsx-a11y/alt-text */
import { ReactNode, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyImage from '../assets/images/define-params.svg';
import styles from './App.module.scss';
import { GlobalHeader } from './shared/components/global-header';
import { RootContextState } from './shared/context/RootContextState';
import { SHARED_EN } from './shared/translate/en';
import { ProtocolQuery } from './components/protocol-query';
import { DashboardMemoized } from './components/dashboard';
import { ITestParams } from './shared/models/quantum.interface';
import { FetchDataStatus } from './shared/hooks/useFetch';
import { Spinner, SpinnerSize } from './shared/components/att-spinner';
import { useDashboardData } from './hooks/useDashboardData';
import { downloadCsvFile } from './utils/download';
import { mapDashboardDataToCsvDataType } from './components/dashboard/utils/dashboard-data-report.util';


const App: React.FC = () => (
  <BrowserRouter>
    <RootContextState>
      <AppContent />
    </RootContextState>
  </BrowserRouter>
);

export default App;

const AppContent: React.FC = () => (
  <>
    <GlobalHeader className={styles.global_header} title={SHARED_EN.WEB_PORTAL_NAME} />
    <AppBody />
  </>
);

const AppBody: React.FC = () => {
  const { handleRunQueryClick, data, algorithms, status } = useDashboardData();

  const handleRunClick: (params: ITestParams) => void = useCallback((params: ITestParams): void => {
    handleRunQueryClick(params);
  }, [handleRunQueryClick]);

  const handleDownloadDataClicked: () => void = useCallback((): void => {
    // todo rename file name
    const csvFileName: string = 'pqc.csv';
    downloadCsvFile(mapDashboardDataToCsvDataType(data), csvFileName);
  }, [data]);
  console.log('dta', data);
  return (
    <div className={styles.app_wrapper}>
      <ProtocolQuery isFetching={status === FetchDataStatus.Fetching} onRunClick={handleRunClick} canExportFile={!!data.size} onDownloadDataClicked={handleDownloadDataClicked} />
      {algorithms === undefined
        && (
          <DashboardMemoized
            data={data}
          />
        )}
        {status === FetchDataStatus.Fetching && renderSpinner()}
        {status === FetchDataStatus.Init && renderInitialState()}
    </div>
  );
};

function renderSpinner(): ReactNode {
  return (
    <div className={styles.app_spinner_overlay}>
      <div className={styles.app_spinner}>
        <Spinner size={SpinnerSize.MEDIUM} />
      </div>
    </div>
  );
}

function renderInitialState(): ReactNode {
  return (
    <div className={styles.init_state_wrapper}>
      <img src={MyImage} />
      <div>{SHARED_EN.INIT_STATE_DESCRIPTION}</div>
    </div>
  );
}
