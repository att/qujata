import { handleAlgorithmsSelection } from './handleAlgorithmsSelection';
import { AttSelectOption } from '../../../shared/components/att-select';
import { AlgosBySectionDict } from '../hooks';
import { SelectOptionType } from '../ProtocolQuery';
import { algorithmSections } from '../constants';

describe('handleAlgorithmsSelection', () => {
  const algorithmOptions: AttSelectOption[] = [
    { value: algorithmSections[0], label: algorithmSections[0] },
    { value: algorithmSections[1], label: algorithmSections[1] },
    { value: 'option1', label: 'option1' },
    { value: 'option2', label: 'option2' },
    { value: algorithmSections[2], label: algorithmSections[2] },
    { value: 'option3', label: 'option3' },
    { value: 'option4', label: 'option4' },
    { value: algorithmSections[3], label: algorithmSections[3] },
    { value: 'option5', label: 'option5' },
    { value: 'option6', label: 'option6' },
  ];
  const algosBySection: AlgosBySectionDict = {
    [algorithmSections[0]]: [
      { value: 'option1', label: 'option1'},
      { value: 'option2', label: 'option2'},
      { value: 'option3', label: 'option3'},
      { value: 'option4', label: 'option4'},
      { value: 'option5', label: 'option5'},
      { value: 'option6', label: 'option6'},
    ],
    [algorithmSections[1]]: [
      { value: 'option1', label: 'option1'},
      { value: 'option2', label: 'option2'},
    ],
    [algorithmSections[2]]: [
      { value: 'option3', label: 'option3'},
      { value: 'option4', label: 'option4'},
    ],
    [algorithmSections[3]]: [
      { value: 'option5', label: 'option5'},
      { value: 'option6', label: 'option6'},
    ],
  };

  it('should handle no algorithms selected', () => {
    const options: SelectOptionType = [];
    const prevSelectedValues: string[] = [];

    const { newSelectedOptions, selectedValues } =
      handleAlgorithmsSelection(options, algorithmOptions, algosBySection, prevSelectedValues);

    expect(selectedValues).toStrictEqual([]);
    expect(newSelectedOptions).toStrictEqual([]);
  });

  it('should handle new section selected', () => {
    const options: SelectOptionType = [
      { value: algorithmSections[0], label: algorithmSections[0] },
    ];
    const prevSelectedValues: string[] = [];

    const { newSelectedOptions, selectedValues } =
      handleAlgorithmsSelection(options, algorithmOptions, algosBySection, prevSelectedValues);

    expect(selectedValues).toStrictEqual(['option1', 'option2', 'option3', 'option4', 'option5', 'option6']);
    expect(newSelectedOptions).toStrictEqual([
      { label: 'option1', value: 'option1' },
      { label: 'option2', value: 'option2' },
      { label: 'option3', value: 'option3' },
      { label: 'option4', value: 'option4' },
      { label: 'option5', value: 'option5' },
      { label: 'option6', value: 'option6' },
    ]);
  });

  it('should handle section deselected', () => {
    const options: SelectOptionType = [
      { value: algorithmSections[0], label: algorithmSections[0] }
    ];
    const prevSelectedValues: string[] = [algorithmSections[0]];

    const { newSelectedOptions, selectedValues } =
      handleAlgorithmsSelection(options, algorithmOptions, algosBySection, prevSelectedValues);

    expect(selectedValues).toStrictEqual([algorithmSections[0]]);
    expect(newSelectedOptions).toStrictEqual([{ label: algorithmSections[0], value: algorithmSections[0], isDisabled: false }]);
  });

  it('should handle new option selected', () => {
    const options: SelectOptionType = [
      { value: 'option1', label: 'option1' }
    ];
    const prevSelectedValues: string[] = [];

    const { newSelectedOptions, selectedValues } =
      handleAlgorithmsSelection(options, algorithmOptions, algosBySection, prevSelectedValues);

    expect(selectedValues).toStrictEqual(['option1']);
    expect(newSelectedOptions).toStrictEqual([{ label: 'option1', value: 'option1' }]);
  });
});