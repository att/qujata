import { ReactNode, useMemo } from 'react';
import styles from './ExperimentTable.module.scss';
import { EXPERIMENT_TABLE_EN } from './translate/en';
import { IExperimentData } from '../../Experiment';
import { Table, TableColumn } from '../../../../../../shared/components/table';

const headers: TableColumn[] = [
  {
    id: 'hashtag',
    header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.HASHTAG}</span>,
    accessor: () => '#',
    cell: cellInfo => <span>{cellInfo.row.index + 1}</span>
  },
  {
    id: 'algorithm',
    header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.ALGORITHM}</span>,
    accessor: row => row.algorithm,
    cell: info => <span>{info.getValue() as ReactNode}</span>
  },
  {
    id: 'iterations',
    header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS}</span>,
    accessor: row => row.iterations,
    cell: info => <span>{info.getValue() as ReactNode}</span>
  },
  {
    id: 'averageCPU',
    header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_CPU}</span>,
    accessor: row => row.results.averageCPU,
    cell: info => <span>{info.getValue() as ReactNode}</span>
  },
  {
    id: 'averageMemory',
    header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_MEMORY}</span>,
    accessor: row => row.results.averageMemory,
    cell: info => <span>{info.getValue() as ReactNode}</span>
  },
];

export const ExperimentTable: React.FC<IExperimentData> = (props: IExperimentData) => {
  const data = useMemo(() => (props.data ? props.data.testRuns : []), [props.data]);

  return (
    <div className={styles.experiment_table_wrapper}>
      <Table headers={headers} data={data} />
    </div>
  );
};
