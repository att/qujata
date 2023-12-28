import { convertDataToOptions } from './convert-data-to-options.utils';
import { TableOptionsData } from '../../../constants/table-options.const';

describe('convertDataToOptions', () => {
  it('should convert data to options', () => {
    const result = convertDataToOptions(TableOptionsData);

    expect(result).toEqual(
      TableOptionsData.options.map((option) => ({
        label: option,
        value: option,
      }))
    );
  });
});
