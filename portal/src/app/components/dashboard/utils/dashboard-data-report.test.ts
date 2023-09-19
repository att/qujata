import { ChartDataMap } from '../../../shared/models/quantum.interface';
import { mapDashboardDataToCsvDataType } from './dashboard-data-report.util';

const mockData: Map<string, unknown> = new Map<string, unknown>();
mockData.set('key', { label: 'prime256v1', value: 'prime256v1' });
mockData.set('value', { totalTime: [23, 12, 3], connectTime: [3, 4 , 22], downloadSpeed: [2, 9, 11]});

describe('Dashboard Data Report Util Test', () => {
  it('should correctly map an data to CsvDataType', () => {
    const expectedResult = [
      ['Algorithm',
      'Session Time - Avg',
      'Session Handshake Time - Avg',
      'Download Speed - Avg',],
      [undefined, 'NaN', 'NaN', 'NaN'],
      [undefined, '12666.67', '9666.67', '0.01']
    ];

    const result = mapDashboardDataToCsvDataType(mockData as unknown as ChartDataMap);
    expect(result).toEqual(expectedResult);
  });
});
