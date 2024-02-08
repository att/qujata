import { convertDataToOptions } from './convert-data-to-options.utils';
import { TableOptionsData } from '../../../constants/table-options.const';

describe('convertDataToOptions', () => {
  it('should convert data to options', () => {
    const result = convertDataToOptions(TableOptionsData);

    expect(result).toEqual([
      {
        label: 'iterations',
        value: TableOptionsData.options[0]
      },
      {
        label: 'results.average_cpu',
        value: TableOptionsData.options[1]
      },
      {
        label: 'results.averageMemory',
        value: TableOptionsData.options[2]
      },
      {
        label: 'results.bytes_throughput',
        value: 'Throughput (bytes/sec)'
      },
      {
        label: 'results.request_throughput',
        value: 'Throughput (message/sec)'
      }
    ]);
  });
});
