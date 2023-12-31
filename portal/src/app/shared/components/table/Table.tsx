import styles from './Table.module.scss';
import {
  Cell,
  CellContext,
  ColumnDef,
  Header,
  HeaderContext,
  HeaderGroup,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { ITestRunResultData } from '../../models/test-run-result.interface';

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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className={styles.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup: HeaderGroup<ITestRunResultData>) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: Header<ITestRunResultData, unknown>) => (
              <th key={header.id} className={styles.table_titles}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className={styles.table_content}>
        {table.getRowModel().rows.map((row: Row<ITestRunResultData>) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell: Cell<any, unknown>) => (
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
