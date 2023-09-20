import { mean, round } from 'lodash';
import { ChartDataMap } from '../../../shared/models/quantum.interface';
import { CsvDataType } from '../../../utils/download';
import { DASHBOARD_EN } from '../translate/en';

const DashboardDataReportCsvFileTitles: string[] = [
  DASHBOARD_EN.CSV_REPORT.TABLE.COLUMNS.ALGORITHM,
  DASHBOARD_EN.CSV_REPORT.TABLE.COLUMNS.SESSION_TIME,
  DASHBOARD_EN.CSV_REPORT.TABLE.COLUMNS.SESSION_HANDSHAKE_TIME,
  DASHBOARD_EN.CSV_REPORT.TABLE.COLUMNS.DOWNLOAD_SPEED,
];

export function mapDashboardDataToCsvDataType(data: ChartDataMap): CsvDataType {
  const convertedData: IConvertData[] = convertData(data);
  return [
    DashboardDataReportCsvFileTitles,
    ...convertedData.map((item: IConvertData) => [
      item.algorithm,
      item.totalTime,
      item.connectTime,
      item.downloadSpeed,
    ])
  ];
}

interface IConvertData {
  algorithm: string;
  totalTime: string;
  connectTime: string;
  downloadSpeed: string;
}

function convertData(data: ChartDataMap): IConvertData[] {
  let convertedData: IConvertData[] = [];

  data.forEach((value, key) => {
    const connectTime = round(mean(value?.connectTime) * 1000, 2).toString();
    const totalTime = round(mean(value?.totalTime) * 1000, 2).toString();
    const downloadSpeed = (mean(value?.downloadSpeed) as number / 1024).toFixed(2);

    const convertedDataItem = {
      algorithm: key.label,
      totalTime: totalTime,
      connectTime: connectTime,
      downloadSpeed: downloadSpeed,
    };

    convertedData.push(convertedDataItem);
  });

  return convertedData;
}