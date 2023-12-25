import { TableOptionsData } from '../../../constants/table-options.const';

export function convertDataToOptions(data: typeof TableOptionsData) {
  return data.options.map((option) => {
    return ({
      label: option,
      value: option,
    });
  });
}