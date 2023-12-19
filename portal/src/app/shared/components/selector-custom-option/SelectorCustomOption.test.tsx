import { render, fireEvent, RenderResult } from '@testing-library/react';
import { components } from 'react-select';
import { AlgorithmsSelectorCustomOption, IterationsSelectorCustomOption, SelectorCustomOptionProps } from './SelectorCustomOption';
import { algorithmSections } from '../../../components/protocol-query/constants';

describe('SelectorCustomOption', () => {
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
    getValue: jest.fn(),
    hasValue: true,
    isMulti: true,
    isRtl: false,
    options: [],
    selectProps: expect.any(Object),
    setValue: jest.fn(),
    theme: expect.any(Object),
    onOptionChanged: jest.fn(),
  };

  it('should render AlgorithmsSelectorCustomOption correctly', () => {
    const { container }: RenderResult = render(<AlgorithmsSelectorCustomOption {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render IterationsSelectorCustomOption correctly', () => {
    const { container }: RenderResult = render(<IterationsSelectorCustomOption {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});