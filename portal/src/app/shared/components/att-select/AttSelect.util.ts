import { OptionProps } from 'react-select';
import { AttSelectOption } from './AttSelect.model';

export function getSelectOptionClassName({ cx, isDisabled, isFocused, isSelected, data }: OptionProps<AttSelectOption, boolean>): string {
  return cx(
    {
      option: true,
      // from some reason in production build isDisabled is coming with wrong value, to insure it we will check also isDisabled value in data object
      // this is the same place react-select is taking isDisabled value (see: builtins.ts file -> isOptionDisabled function)
      // react-select expose isOptionDisabled function which return true/false if the option should be disabled, it's getting also option object (our data object)
      'option--is-disabled': isDisabled || !!data.isDisabled,
      'option--is-focused': isFocused,
      'option--is-selected': isSelected,
    },
  );
}
