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
import { ChartDataMap, ITestParams, ITestResponse, ITestResponseData } from './shared/models/quantum.interface';
import { FetchDataStatus, IHttp, useFetch } from './shared/hooks/useFetch';
import { APIS } from './apis';
import { AttSelectOption } from './shared/components/att-select';
import { Spinner, SpinnerSize } from './shared/components/att-spinner';


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
  const { post, data: testResponse, status }: IHttp<ITestResponse> = useFetch<ITestResponse>({ url: APIS.analyze });
  const [dashboardData, setDashboardData] = useState<ChartDataMap>(() => new Map<AttSelectOption, ITestResponseData | undefined>());
  const [iterationsCount, setIterationsCount] = useState<number>(1);
  const [algorithms, setAlgorithms] = useState<string[] | undefined>([]);

  const handleRunClick: (params: ITestParams) => void = useCallback((params: ITestParams): void => {
    const algos: AttSelectOption[] = params.algorithms as AttSelectOption[];
    const map: ChartDataMap = new Map<AttSelectOption, ITestResponseData | undefined>();
    const algoValues: string[] = [];
    algos.forEach((algo: AttSelectOption) => {
      map.set(algo, undefined);
      algoValues.push(algo.value);
    });
    setAlgorithms(algoValues);
    setDashboardData(map);
    setIterationsCount(params.iterationsCount);
    if (algos?.length > 0) {
      post({ data: { algorithm: algos[0].value, iterationsCount: params.iterationsCount } });
    }
  }, [post]);

  useEffect(() => {
    if (testResponse) {
      setAlgorithms((prev: string[] | undefined) => {
        prev?.splice(0, 1);
        if (prev && prev.length > 0) {
          post({ data: { algorithm: prev[0], iterationsCount } });
          return prev;
        }
        return undefined;
      });
      setDashboardData((prev: ChartDataMap) => {
        let shouldSkip:boolean = false;
        prev.forEach((value: ITestResponseData | undefined, key: AttSelectOption) => {
          if (!shouldSkip && value === undefined) {
            shouldSkip = true;
            prev.set(key, testResponse.data);
          }
        });
        return prev;
      });
    }
  }, [algorithms, iterationsCount, post, testResponse]);

  const isFetching: boolean = status === FetchDataStatus.Fetching;

  return (
    <div className={styles.app_wrapper}>
      <ProtocolQuery isFetching={isFetching} onRunClick={handleRunClick} />
      {algorithms === undefined
        && (
          <DashboardMemoized
            data={dashboardData}
          />
        )}
      <div className={styles.image_wrapper}>
        {isFetching && renderSpinner()}
        {status === FetchDataStatus.Init
          && (
            <div className={styles.init_image}>
              <img src={MyImage} />
              <div>Define parameters to view the dashboard</div>
            </div>
          )}
      </div>
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