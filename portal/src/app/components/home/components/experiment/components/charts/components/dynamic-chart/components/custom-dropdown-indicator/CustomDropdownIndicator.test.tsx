import { fireEvent, render, RenderResult } from '@testing-library/react';
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
      selectProps: { menuIsOpen: false, onMenuOpen: jest.fn(), onMenuClose: jest.fn() } as any,
      setValue: jest.fn(),
      theme: undefined as any,
  };

  test('should render CustomDropdownIndicator when the menu is close', () => {
    const { container, getByTestId }: RenderResult = render(<CustomDropdownIndicator {...mockProps} />);

    const dropdownIndicatorWrapperElement: HTMLElement = getByTestId('dropdown_indicator_wrapper');
    fireEvent.click(dropdownIndicatorWrapperElement);

    expect(container).toBeTruthy();
    expect(mockProps.selectProps.onMenuOpen).toHaveBeenCalled();
    expect(mockProps.selectProps.onMenuClose).not.toHaveBeenCalled();
  });

  test('should render CustomDropdownIndicator when the menu is open', () => {
    mockProps.selectProps.menuIsOpen = true;
    const { container, getByTestId }: RenderResult = render(<CustomDropdownIndicator {...mockProps} />);

    const dropdownIndicatorWrapperElement: HTMLElement = getByTestId('dropdown_indicator_wrapper');
    fireEvent.click(dropdownIndicatorWrapperElement);

    expect(container).toBeTruthy();
    expect(mockProps.selectProps.onMenuOpen).not.toHaveBeenCalled();
    expect(mockProps.selectProps.onMenuClose).toHaveBeenCalled();
  });
});
