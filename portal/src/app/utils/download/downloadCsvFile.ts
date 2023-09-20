// Create a download  anchor element to "point" to it when downloading data as file
import { downloadDataAsFile } from './downloadDataAsFile';

export type CsvDataType = DataTypeRow[];
type DataTypeRow = DataTypeCell[];
type DataTypeCell = string | number;

function arrayToCSV(data: CsvDataType): string {
  return data.map(mapRow).join('\n');
}

function mapRow(row: DataTypeRow): string {
  return row.map((cell: DataTypeCell) => `"${cell}"`).join(',');
}

export function downloadCsvFile(data: CsvDataType, filename: string = 'data.csv'): void {
  // Create a URL for the blob
  const csvData: string = arrayToCSV(data);
  const blob: Blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  downloadDataAsFile(filename, blob);
}
