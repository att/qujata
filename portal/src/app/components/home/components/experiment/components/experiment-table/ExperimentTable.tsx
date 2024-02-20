import { ReactNode, useMemo } from 'react';
import styles from './ExperimentTable.module.scss';
import { EXPERIMENT_TABLE_EN } from './translate/en';
import { QujataTable, TableColumn } from '../../../../../../shared/components/qujata-table';
import { ITestRunResult, ITestRunResultData } from '../../../../../../shared/models/test-run-result.interface';
import { AttSelectOption } from '../../../../../../shared/components/att-select';
import { CellContext } from '@tanstack/react-table';

export interface ExperimentTableProps {
  data: ITestRunResult;
  selectedColumns: AttSelectOption[];
}

export const ExperimentTable: React.FC<ExperimentTableProps> = (props: ExperimentTableProps) => {
  const data = useMemo(() => (props.data ? props.data.test_runs : []), [props.data]);
  
  const headers: TableColumn<ITestRunResultData>[] = useMemo(() => [
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
      header: () => <span>{column.value}</span>,
      accessor: (row: ITestRunResultData) => {
        const parts = column.label.split('.');
        let value: any = row;
        for (const part of parts) {
          value = value[part as keyof typeof value];
        }
        return value;
      },
      cell: (cellInfo: CellContext<ITestRunResultData, unknown>) => <span>{cellInfo.getValue() as ReactNode}</span>
    }))
  ], [props.selectedColumns]);

  return (
    <div className={styles.experiment_table_wrapper}>
      <QujataTable className={styles.experiment_table} headers={headers} data={data} />
    </div>
  );
};
