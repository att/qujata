import styles from './Table.module.scss';
import { useMemo, useState } from 'react';
import {
  Cell,
  CellContext,
  ColumnDef,
  Header,
  HeaderContext,
  HeaderGroup,
  Row,
  flexRender,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ITestRunResultData } from '../../models/test-run-result.interface';
import SortascendingSvg from '../../../../assets/images/sort-ascending.svg';
import SortDescendingSvg from '../../../../assets/images/sort-descending.svg';

const SortAscendingLabel: string = 'ascending';
const SortDescendingLabel: string = 'descending';

export interface TableColumn {
  id: string;
  header: (context: HeaderContext<ITestRunResultData, any>) => React.ReactNode;
  accessor: (row: ITestRunResultData) => any;
  cell?: (cellInfo: CellContext<ITestRunResultData, unknown>) => JSX.Element;
}

export interface TableProps {
  headers: TableColumn[];
  data: ITestRunResultData[];
}

export const Table: React.FC<TableProps> = ({ headers, data }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const columns: ColumnDef<ITestRunResultData>[] = useMemo(() => {
    return headers.map(header => ({
      id: header.id,
      header: header.header,
      accessorFn: header.accessor,
      cell: header.cell
    }));
  }, [headers]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className={styles.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup: HeaderGroup<ITestRunResultData>) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: Header<ITestRunResultData, unknown>) => (
              <th key={header.id} className={styles.table_titles}>
                <div
                {...{
                  className: header.column.getCanSort()
                    ? styles.sort_style
                    : '',
                  onClick: header.column.getToggleSortingHandler(),
                }}
                >
                  { flexRender(header.column.columnDef.header, header.getContext()) }
                  { {
                    asc: <label>{' '}<img src={SortascendingSvg} alt={SortAscendingLabel} /></label>,
                    desc: <label>{' '}<img src={SortDescendingSvg} alt={SortDescendingLabel} /></label>,
                  }[header.column.getIsSorted() as string] ?? null }
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className={styles.table_content}>
        {table.getRowModel().rows.map((row: Row<ITestRunResultData>) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell: Cell<ITestRunResultData, unknown>) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
