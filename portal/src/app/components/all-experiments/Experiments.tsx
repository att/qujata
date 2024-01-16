import { useEffect } from 'react';
import styles from './Experiments.module.scss';
import { useNavigate } from "react-router-dom";
import { IUseExperimentsData, useExperimentsData } from './hooks';
import { FetchDataStatus } from '../../shared/hooks/useFetch';
import { Spinner, SpinnerSize } from '../../shared/components/att-spinner';

export const Experiments: React.FC = () => {
  const { experiments, status }: IUseExperimentsData = useExperimentsData();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (status === FetchDataStatus.Success && experiments) {
  //     navigate(`qujata-api/experiments`);
  //   }
  // }, [navigate, status, experiments]);

  return (
    <div className={styles.app_wrapper}>
      {status === FetchDataStatus.Fetching ? renderSpinner() : <span>{'Hello World!!!!'}</span>}
    </div>
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
