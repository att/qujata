import { useMemo, useReducer } from 'react';
import styles from './ExperimentTable.module.scss';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ITestResultData } from '../../../../../../models/test-result.interface';
import { EXPERIMENT_TABLE_EN } from './translate/en';

export type ExperimentProps = {
  data: ITestResultData[];
}

export const ExperimentTable: React.FC<ExperimentProps> = (props: ExperimentProps) => {
  const { data } = props;

  const columnHelper = createColumnHelper<ITestResultData>();
  const columns = useMemo(() => {
    if (data.length > 0) {
      return [
        columnHelper.accessor(row => row.algorithm, {
          id: 'algorithm',
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.ALGORITHM}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
        columnHelper.accessor('iterations', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.ITERATIONS}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
        columnHelper.accessor('messageSizeBytes', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.MESSAGE_SIZE}</span>,
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
        columnHelper.accessor('results.errorRate', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.ERROR_RATE}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
        columnHelper.accessor('results.bytesThroughput', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.BYTES_THROUGHPUT}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
        columnHelper.accessor('results.messagesThroughput', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.MESSAGES_THROUGHPUT}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
        columnHelper.accessor('results.averageTLSHandshakeTime', {
          header: () => <span>{EXPERIMENT_TABLE_EN.TABLE_TITLES.AVERAGE_TLS_HANDSHAKE_TIME}</span>,
          cell: info => <span>{info.getValue()}</span>
        }),
      ];
    }
    return [];
  }, [data, columnHelper]);

  // const [data, setData] = useState(() => [...defaultData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.experiment_table_wrapper}>
      <table className={styles.experiment_table}>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className={styles.experiment_table_titles}>
                {flexRender(header.column.columnDef.header,header.getContext())}
              </th>
            ))}
          </tr>
        ))}
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
