import { ReactNode, useMemo } from 'react';
import styles from './ExperimentTable.module.scss';
import { EXPERIMENT_TABLE_EN } from './translate/en';
import { Table, TableColumn } from '../../../../../../shared/components/table';
import { ITestRunResult, ITestRunResultData } from '../../../../../../shared/models/test-run-result.interface';
import { AttSelectOption } from '../../../../../../shared/components/att-select';
import { CellContext } from '@tanstack/react-table';

export interface ExperimentTableProps {
  data: ITestRunResult;
  selectedColumns: AttSelectOption[];
}

export const ExperimentTable: React.FC<ExperimentTableProps> = (props: ExperimentTableProps) => {
  const data = useMemo(() => (props.data ? props.data.testRuns : []), [props.data]);
  
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
      accessor: (row: ITestRunResultData) => row.algorithm,
      cell: cellInfo => <span>{cellInfo.getValue() as ReactNode}</span>
    },
    ...props.selectedColumns.map((column: AttSelectOption) => ({
      id: column.label,
      header: () => <span>{column.label}</span>,
      accessor: (row: ITestRunResultData) => {
        const parts = column.value.split('.');
        let value: any = row;
        for (const part of parts) {
          value = value[part as keyof typeof value];
        }
        return value;
      },
      cell: (cellInfo: CellContext<ITestRunResultData, unknown>) => <span>{cellInfo.getValue() as ReactNode}</span>
    }))
  ];

  return (
    <div className={styles.experiment_table_wrapper}>
      <Table headers={headers} data={data} />
    </div>
  );
};
