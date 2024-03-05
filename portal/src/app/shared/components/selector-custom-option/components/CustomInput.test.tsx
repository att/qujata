import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { CustomInput } from './CustomInput';
import { SelectorCustomOptionProps } from '../SelectorCustomOption';
import { Button } from '../../att-button';
import { SELECTOR_CUSTOM_OPTION_EN } from '../translate/en';
import { AttSelectOption } from '../../att-select';

jest.mock('../../att-button');

describe('CustomInput', () => {
  let mockOption1: AttSelectOption;
  let mockOption2: AttSelectOption;
  let mockProps: SelectorCustomOptionProps;

  beforeEach(() => {
    mockOption1 = { value: 'option1', label: 'Option 1', metadata: { isInput: true } };
    mockOption2 = { value: 'option1', label: 'Option 1', metadata: { isAddNewButton: true } };
    mockProps = {
      data: mockOption1,
      isSelected: true,
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
      getValue: jest.fn().mockImplementation(() => [mockOption2]),
      hasValue: true,
      isMulti: true,
      isRtl: false,
      options: [mockOption1, mockOption2],
      selectProps: expect.any(Object),
      setValue: jest.fn().mockImplementation((newValue) => {
        [mockOption2] = newValue;
      }),
      theme: expect.any(Object),
      onOptionChanged: jest.fn(),
      showInputOption: true,
      setShowInputOption: jest.fn(),
      inputValue: '1111',
      setInputValue: jest.fn(),
      setMenuIsOpen: jest.fn(),
    };

    (Button as jest.Mock).mockImplementation(({ onButtonClick }) => {
      const applyCustomOption: React.MouseEventHandler<HTMLDivElement> = (event) => {
        onButtonClick(event);
      }
      return <div onClick={applyCustomOption} data-testid='apply_custom_option'>{SELECTOR_CUSTOM_OPTION_EN.ADD_BUTTON}</div>;
    });
  });

  test('should render CustomInput correctly', async () => {
    const { container, getByTestId }: RenderResult = render(<CustomInput {...mockProps} />);
    const applyCustomOptionElement: HTMLElement = getByTestId('apply_custom_option');
    const addNewInputElement: HTMLElement = getByTestId('add_new_input');
    const customInputElement: HTMLElement = getByTestId('custom_input');
    const cleanIconElement: HTMLElement = getByTestId('clean_icon');

    fireEvent.click(applyCustomOptionElement);
    fireEvent.click(addNewInputElement);
    fireEvent.change(customInputElement, { target: { value: 'new value' } });
    fireEvent.click(cleanIconElement);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });

    fireEvent.change(customInputElement, { target: { value: 1234 } });

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should render CustomInput when props is not selected', async () => {
    mockProps.getValue = jest.fn().mockReturnValue(undefined);
    mockProps.isSelected = false;
    mockProps.data = mockOption2;

    (Button as jest.Mock).mockImplementation(({ onButtonClick }) => {
      const applyAddNew: React.MouseEventHandler<HTMLDivElement> = (event) => {
        onButtonClick(event);
      }
      return <div onClick={applyAddNew} data-testid='add_new_option'>{SELECTOR_CUSTOM_OPTION_EN.ADD_BUTTON}</div>;
    });

    const { container, getByTestId }: RenderResult = render(<CustomInput {...mockProps} />);
    const addNewOptionElement: HTMLElement = getByTestId('add_new_option');

    fireEvent.click(addNewOptionElement);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});