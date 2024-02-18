import { render, RenderResult } from '@testing-library/react';
import { CustomOption } from './CustomOption';
import { SelectorCustomOptionProps } from '../../../../../../../../../../shared/components/selector-custom-option';

describe('CustomOption', () => {
  const mockOption = { value: 'option1', label: 'Option 1' };
  const mockProps: SelectorCustomOptionProps = {
    data: mockOption,
    isSelected: false,
    selectOption: jest.fn(),
    label: 'Option 1',
    innerProps: {},
    innerRef: jest.fn(),
    children: null,
    type: 'option',
    isDisabled: false,
    isFocused: false,
    clearValue: jest.fn(),
    cx: jest.fn(),
    getStyles: jest.fn(),
    getClassNames: jest.fn(),
    getValue: jest.fn().mockReturnValue([{ label: 'Option 1', value: 'option1' }]),
    hasValue: true,
    isMulti: true,
    isRtl: false,
    options: [],
    selectProps: expect.any(Object),
    setValue: jest.fn(),
    theme: expect.any(Object),
    onOptionChanged: jest.fn(),
    showInputOption: false,
    setShowInputOption: jest.fn(),
    inputValue: '1111',
    setInputValue: jest.fn(),
    setMenuIsOpen: jest.fn(),
  };

  it('should render CustomOption', () => {
    const { container }: RenderResult = render(<CustomOption {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
