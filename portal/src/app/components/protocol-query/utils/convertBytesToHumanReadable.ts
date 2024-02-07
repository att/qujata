import { filesize } from 'filesize';
import { AttSelectOption } from '../../../shared/components/att-select';

export function convertBytesToHumanReadable(messageSizeOptions: AttSelectOption[]) {
  return messageSizeOptions.map((option: AttSelectOption) => {
    console.log('option', option);
    if (option.value === '' || isNaN(+option.value)) {
      return option;
    }
    const sizeOption = filesize(+option.value, {round: 3});
    return { 
      label: sizeOption, 
      value: sizeOption,
      metadata: option.metadata
    } as AttSelectOption;
  });
}