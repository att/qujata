import { useEffect } from 'react';
import { ISpinner, useSpinnerContext } from '../../context/spinner';
import { FetchDataStatus } from '../useFetch';

export function useFetchSpinner(fetchStatuses: FetchDataStatus, isSilentRequest?: boolean): void {
  const { setSpinner }: ISpinner = useSpinnerContext();

  useEffect(() => {
    setSpinner(fetchStatuses === FetchDataStatus.Fetching && !isSilentRequest);
  }, [setSpinner, fetchStatuses, isSilentRequest]);

  // 1) On component destroyed we will set false
  // 2) On uniqueKey changed we will set false for previousKey value
  useEffect(() => () => {
    setSpinner(false);
  }, [setSpinner]);
}
