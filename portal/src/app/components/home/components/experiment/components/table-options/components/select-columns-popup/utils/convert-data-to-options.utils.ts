import { TableOptionsData } from '../../../constants/table-options.const';

export function convertDataToOptions(data: typeof TableOptionsData) {
  return [
    {
      label: 'iterations',
      value: data.options[0]
    },
    {
      label: 'results.average_cpu',
      value: data.options[1]
    },
    {
      label: 'results.average_memory',
      value: data.options[2]
    },
    {
      label: 'results.bytes_throughput',
      value: data.options[3]
    },
    {
      label: 'results.request_throughput',
      value: data.options[4]
    }
  ];
}