import styles from './Table.module.scss';
import cn from 'classnames';
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
import SortascendingSvg from '../../../../assets/images/sort-ascending.svg';
import SortDescendingSvg from '../../../../assets/images/sort-descending.svg';

const SortAscendingLabel: string = 'ascending';
const SortDescendingLabel: string = 'descending';

export interface TableColumn<T> {
  id: string;
  header: (context: HeaderContext<T, any>) => React.ReactNode;
  accessor: (row: T) => any;
  cell?: (cellInfo: CellContext<T, unknown>, row?: T) => JSX.Element;
}

export interface TableProps<T> {
  className?: string;
  headers: TableColumn<T>[];
  data: T[];
}

export const Table = <T extends any>({ headers, data, className }: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const columns: ColumnDef<T>[] = useMemo(() => {
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
    <table className={cn(styles.table, className)}>
      <thead>
        {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: Header<T, unknown>) => (
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
        {table.getRowModel().rows.map((row: Row<T>) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
              <td key={cell.id} className={styles.table_content}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
