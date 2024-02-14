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
        label: 'message_size',
        value: TableOptionsData.options[1]
      },
      {
        label: 'results.averageCPU',
        value: TableOptionsData.options[2]
      },
      {
        label: 'results.averageMemory',
        value: TableOptionsData.options[3]
      }
    ]);
  });
});
