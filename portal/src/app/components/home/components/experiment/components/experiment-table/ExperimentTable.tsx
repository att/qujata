import { useMemo } from 'react';
import styles from './ExperimentTable.module.scss';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EXPERIMENT_TABLE_EN } from './translate/en';
import { ITestRunResultData } from '../../../../../../shared/models/test-run-result.interface';
import { IExperimentData } from '../../Experiment';

export const ExperimentTable: React.FC<IExperimentData> = (props: IExperimentData) => {
  const columnHelper = createColumnHelper<ITestRunResultData>();
  const columns = useMemo(() => {
    if (props.data && props.data.testRuns.length > 0) {
      return [
        columnHelper.accessor(() => '#', {
          id: `${EXPERIMENT_TABLE_EN.TABLE_TITLES.HASHTAG}`,
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.HASHTAG}</span>,
          cell: cellInfo => <span>{cellInfo.row.index + 1}</span>,
          minSize: 3,
          maxSize: 300,
        }),
        columnHelper.accessor(row => row.algorithm, {
          id: 'algorithm',
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.ALGORITHM}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
        columnHelper.accessor('iterations', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
        columnHelper.accessor('results.averageCPU', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_CPU}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
        columnHelper.accessor('results.averageMemory', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_MEMORY}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
      ];
    }
    return [];
  }, [props.data, columnHelper]);

  const data = useMemo(() => (props.data ? props.data.testRuns : []), [props.data]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.experiment_table_wrapper}>
      <table className={styles.experiment_table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className={styles.experiment_table_titles}>
                  {flexRender(header.column.columnDef.header,header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.experiment_table_content}>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={styles.experiment_table_cell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
