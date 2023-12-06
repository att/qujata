import { downloadCsvFile, CsvDataType } from './downloadCsvFile';
import { downloadDataAsFile } from './downloadDataAsFile';

jest.mock('./downloadDataAsFile', () => ({
  downloadDataAsFile: jest.fn(),
}));

describe('downloadCsvFile', () => {
  it('converts data to CSV and downloads it', () => {
    const data: CsvDataType = [
      ['Name', 'Age'],
      ['John Doe', 30],
      ['Jane Doe', 25],
    ];
    const filename = 'test.csv';

    downloadCsvFile(data, filename);

    const csvData = '"Name","Age"\n"John Doe","30"\n"Jane Doe","25"';
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    expect(downloadDataAsFile).toHaveBeenCalledWith(filename, blob);
  });

  it('uses default filename if not provided', () => {
    const data: CsvDataType = [
      ['Name', 'Age'],
      ['John Doe', 30],
      ['Jane Doe', 25],
    ];

    downloadCsvFile(data);

    const csvData = '"Name","Age"\n"John Doe","30"\n"Jane Doe","25"';
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    expect(downloadDataAsFile).toHaveBeenCalledWith('data.csv', blob);
  });
});
