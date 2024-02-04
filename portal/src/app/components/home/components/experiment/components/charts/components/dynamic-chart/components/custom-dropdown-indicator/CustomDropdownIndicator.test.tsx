import { render, RenderResult } from '@testing-library/react';
import { CustomDropdownIndicator } from './CustomDropdownIndicator';
import { DropdownIndicatorProps } from 'react-select';
import { AttSelectOption } from '../../../../../../../../../../shared/components/att-select';

describe('CustomDropdownIndicator', () => {
  const mockProps: DropdownIndicatorProps<AttSelectOption, any> = {
      innerProps: undefined as any,
      isFocused: false,
      isDisabled: false,
      clearValue: jest.fn(),
      cx: jest.fn(),
      getStyles: jest.fn(),
      getClassNames: jest.fn(),
      getValue: jest.fn(),
      hasValue: false,
      isMulti: false,
      isRtl: false,
      options: [],
      selectOption: jest.fn(),
      selectProps: undefined as any,
      setValue: jest.fn(),
      theme: undefined as any,
  };

  it('should render CustomDropdownIndicator', () => {
    const { container }: RenderResult = render(<CustomDropdownIndicator {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
