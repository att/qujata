/* eslint-disable jsx-a11y/alt-text */
import { ReactNode, useCallback, useEffect, useState } from 'react';
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
import { SubHeader } from './components/sub-header';
import { ExternalLink, LinkRel, LinkSize, LinkStyle, LinkTarget } from './shared/components/att-link';
import { Environment } from '../environments/environment';
import { DashBoardPrefixLink } from './shared/constants/dashboard';
import { ToastContainer } from 'react-toastify';
import { ToastContainerConfig } from './shared/components/toast/toast-container-config.const';


const App: React.FC = () => (
  <BrowserRouter>
    <RootContextState>
      <ToastContainer {...ToastContainerConfig} />
      <AppContent />
    </RootContextState>
  </BrowserRouter>
);

export default App;

const AppContent: React.FC = () => {
  const [isSubHeaderOpen, setIsSubHeaderOpen] = useState<boolean>(true);

  const handleSubHeaderCloseClick: () => void = useCallback((): void => {
    setIsSubHeaderOpen(false);
  }, []);
  
  return (
    <>
      <GlobalHeader className={styles.global_header} title={SHARED_EN.WEB_PORTAL_NAME} />
      {isSubHeaderOpen && <SubHeader handleCloseClick={handleSubHeaderCloseClick} />}
      <AppBody />
    </>
  );
}
const generateFromTime: number = Date.now();
const initialLink: string = `${Environment.dashboardLinkHost}/${DashBoardPrefixLink}&from=${generateFromTime}`;
const AppBody: React.FC = () => {
  //const { handleRunQueryClick, data, algorithms, status } = useDashboardData();
  const { handleRunQueryClick, link, status } = useDashboardData();
  const [dashBoardLink, setDashBoardLink] = useState<string>(link);
  console.log('link=== ', link);
  const [displayLinkButton, setDisplayLinkButton] = useState<boolean>(false);

  useEffect(() => {
    setDashBoardLink(link);
  }, [link]);
  
  const handleRunClick: (params: ITestParams) => void = useCallback((params: ITestParams): void => {
    if (params.algorithms && params.iterationsCount) {
      setDisplayLinkButton(true);
      handleRunQueryClick(params);
      setDashBoardLink(initialLink);
    }
  }, [handleRunQueryClick]);

  // const handleDownloadDataClicked: () => void = useCallback((): void => {
  //   // todo rename file name
  //   const csvFileName: string = 'pqc.csv';
  //   downloadCsvFile(mapDashboardDataToCsvDataType(data), csvFileName);
  // }, [data]);

  return (
    <div className={styles.app_wrapper}>
      {!dashBoardLink?.length && <div className={styles.protocol_query_title}>{SHARED_EN.TITLE}</div>}
      <ProtocolQuery isFetching={status === FetchDataStatus.Fetching} onRunClick={handleRunClick} />
      {(dashBoardLink?.length > 0 && displayLinkButton) &&
        <div className={styles.response_wrapper}>
          <ExternalLink
              className={styles.response_link}
              link={dashBoardLink}
              styleType={LinkStyle.TEXT}
              size={LinkSize.NONE}
              target={LinkTarget.BLANK}
              rel={LinkRel.NO_OPENER}
            >
              {SHARED_EN.LINK_TEXT}
          </ExternalLink>
        </div>
        // && (
        //   <DashboardMemoized
        //     data={data}
        //   />
        // )
        }
        {/* {status === FetchDataStatus.Fetching && renderSpinner()} */}
        {/* {status === FetchDataStatus.Init && renderInitialState()} */}
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
