import { ReactNode, useMemo, useState } from 'react';
import { Table, TableColumn } from '../../../../shared/components/table';
import styles from './LatestExperiments.module.scss';
import { LATEST_EXPERIMENTS_EN } from './translate/en';
import { IUseExperimentsData, useExperimentsData } from '../../../all-experiments/hooks';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';
import { Experiment, TestRunSubset } from '../../../all-experiments/models/experiments.interface';
import { Link } from 'react-router-dom';
import { QujataInsight } from '../../../../shared/components/qujata-insight';
import CloseSvg from '../../../../../assets/images/close.svg';

export const LatestExperiments: React.FC = () => {
  const { testSuites, status }: IUseExperimentsData = useExperimentsData();
  const [isInsightShowed, setIsInsightShowed] = useState(true);
  
  const data = useMemo(() => (status === FetchDataStatus.Success && testSuites
    ? testSuites.sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
    : []
  ), [status, testSuites]);

  const headers: TableColumn<Experiment>[] = useMemo(() => [
    {
      id: 'experimentName',
      header: () => <span>{LATEST_EXPERIMENTS_EN.TABLE_TITLES.EXPERIMENT_NAME}</span>,
      accessor: (row: Experiment) => row.name,
      cell: cellInfo => (
        <Link
          className={styles.experiment_link}
          to={`${LATEST_EXPERIMENTS_EN.HOMEPAGE_LINK}/experiment/${cellInfo.row.original.id}`}>
          <span className={styles.experiment_name}>{cellInfo.getValue() as ReactNode}</span>
        </Link>
      )
    },
    {
      id: 'date',
      header: () => <span>{LATEST_EXPERIMENTS_EN.TABLE_TITLES.DATE}</span>,
      accessor: (row: Experiment) => row.end_time,
      cell: cellInfo => {
        const date = new Date(cellInfo.getValue() as Date);
        const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        return <span>{formattedDate}</span>
      }
    },
    {
      id: 'numberOfAlgorithms',
      header: () => <span>{LATEST_EXPERIMENTS_EN.TABLE_TITLES.NUMBER_OF_ALGORITHMS}</span>,
      accessor: (row: Experiment) => {
        const algorithms = new Set<string>();
        row.test_runs.forEach((testRun: TestRunSubset) => algorithms.add(testRun.algorithm));
        return algorithms.size;
      },
      cell: cellInfo => <span>{cellInfo.getValue() as ReactNode}</span>
    },
    {
      id: 'iterations',
      header: () => <span>{LATEST_EXPERIMENTS_EN.TABLE_TITLES.ITERATIONS}</span>,
      accessor: (row: Experiment) => {
        const iterations = new Set<number>();
        row.test_runs.forEach((testRun: TestRunSubset) => iterations.add(testRun.iterations));
        return Array.from(iterations).sort((a, b) => a - b).join(', ');
      },
      cell: cellInfo => <span>{cellInfo.getValue() as ReactNode}</span>
    },
    {
      id: 'messageSizes',
      header: () => <span>{LATEST_EXPERIMENTS_EN.TABLE_TITLES.MESSAGE_SIZE}</span>,
      accessor: (row: Experiment) => {
        const messageSizes = new Set<number>();
        row.test_runs.forEach((testRun: TestRunSubset) => messageSizes.add(testRun.message_size));
        return Array.from(messageSizes).sort((a, b) => a - b).join(', ');
      },
      cell: cellInfo => <span>{cellInfo.getValue() as ReactNode}</span>
    },
  ], []);
  
  return ( status === FetchDataStatus.Success &&
      <div className={styles.latest_experiments_wrapper}>
        <h2 className={styles.latest_experiments_title}>{LATEST_EXPERIMENTS_EN.TITLE}</h2>
        <Table className={styles.latest_experiments_table} headers={headers} data={data} enableSorting={false} />
        {isInsightShowed && <QujataInsight
          closeImageUrl={CloseSvg}
          onInsightClose={() => setIsInsightShowed(false)}
          title={LATEST_EXPERIMENTS_EN.INSIGHT.TITLE}
          description={LATEST_EXPERIMENTS_EN.INSIGHT.DESCRIPTION}
          linkName={LATEST_EXPERIMENTS_EN.INSIGHT.LINK_TITLE}
          linkUrl='/qujata/experiment/15' // TODO: understand where this link should lead to
        />}
      </div>
  );
}
