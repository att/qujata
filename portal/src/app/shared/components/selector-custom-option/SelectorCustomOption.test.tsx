import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { AlgorithmsSelectorCustomOption, SelectorCustomOption, SelectorCustomOptionProps } from './SelectorCustomOption';
import { AttSelectOption } from '../att-select';

jest.mock('../../../components/protocol-query/constants', () => ({
  algorithmSections: ['All', 'Classic', 'Hybrid', 'PQ']
}));

describe('SelectorCustomOption', () => {
  let mockOption: AttSelectOption;
  let mockProps: SelectorCustomOptionProps;

  beforeEach(() => {
    mockOption = { value: 'Classic', label: 'Classic' };

    mockProps = {
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
  });

  test('should render AlgorithmsSelectorCustomOption correctly', async () => {
    const { container, getByTestId }: RenderResult = render(<AlgorithmsSelectorCustomOption {...mockProps} />);
    const algorithmCheckboxElement: HTMLElement = getByTestId('algorithm_checkbox');

    fireEvent.click(algorithmCheckboxElement);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should render AlgorithmsSelectorCustomOption correctly when the prop isSelected', async () => {
    mockProps.isSelected = true;
    mockProps.data = { value: 'non-title', label: 'non-title' };
    const { container, getByTestId }: RenderResult = render(<AlgorithmsSelectorCustomOption {...mockProps} />);
    const algorithmCheckboxElement: HTMLElement = getByTestId('algorithm_checkbox');

    fireEvent.click(algorithmCheckboxElement);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should render SelectorCustomOption correctly', async () => {
    const { container, getByTestId }: RenderResult = render(<SelectorCustomOption {...mockProps} />);
    const algorithmCheckboxElement: HTMLElement = getByTestId('selector_custom_option_checkbox');

    fireEvent.click(algorithmCheckboxElement);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should render SelectorCustomOption correctly when the prop isSelected', async () => {
    mockProps.isSelected = true;
    mockProps.data = { value: 'non-title', label: 'non-title' };
    const { container, getByTestId }: RenderResult = render(<SelectorCustomOption {...mockProps} />);
    const algorithmCheckboxElement: HTMLElement = getByTestId('selector_custom_option_checkbox');

    fireEvent.click(algorithmCheckboxElement);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});