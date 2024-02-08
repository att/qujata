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
        label: 'results.average_memory',
        value: TableOptionsData.options[2]
      },
      {
        label: 'results.bytes_throughput',
        value: TableOptionsData.options[3]
      },
      {
        label: 'results.request_throughput',
        value: TableOptionsData.options[4]
      }
    ]);
  });
});
