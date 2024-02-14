import { convertBytesToHumanReadable } from './convertBytesToHumanReadable';
import { AttSelectOption } from '../../../shared/components/att-select';

describe('convertBytesToHumanReadable', () => {
  it('should convert bytes to human readable format', () => {
    const input: AttSelectOption[] = [
      { label: '1024', value: '1024' },
      { label: '204800', value: '204800' },
      { label: '1048576', value: '1048576' },
    ];

    const output = convertBytesToHumanReadable(input);

    expect(output).toEqual([
      { label: '1.024 kB', value: '1.024 kB', metadata: undefined },
      { label: '204.8 kB', value: '204.8 kB', metadata: undefined },
      { label: '1.049 MB', value: '1.049 MB', metadata: undefined },
    ]);
  });

  it('should return the original option if value is not a number', () => {
    const input: AttSelectOption[] = [
      { label: '', value: '', metadata: { isInput: true } },
      { label: '+ Add new', value: '+ Add new', metadata: { isAddNewButton: true } },
    ];

    const output = convertBytesToHumanReadable(input);

    expect(output).toEqual(input);
  });
});
