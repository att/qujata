import { fireEvent, render, RenderResult } from '@testing-library/react';
import { CustomValueContainer } from './CustomValueContainer';
import { GroupBase, ValueContainerProps } from 'react-select';
import { AttSelectOption } from '../../../../../../../../../../shared/components/att-select';
import { useOutsideClick } from '../../../../../../../../../../hooks/useOutsideClick';
import { useRef } from 'react';

jest.mock('../../../../../../../../../../hooks/useOutsideClick');

describe('CustomValueContainer', () => {
  let mockProps: ValueContainerProps<AttSelectOption<any>, boolean, GroupBase<AttSelectOption<any>>>;

  beforeEach(() => {
    mockProps = {
      children: undefined,
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
      theme: undefined as any
    };
  });

  test('should render CustomValueContainer', () => {
    const { container, getByTestId }: RenderResult = render(<CustomValueContainer {...mockProps} />);

    const valueContainerWrapperElement: HTMLElement = getByTestId('value_container_wrapper');
    fireEvent.click(valueContainerWrapperElement);

    expect(container).toBeTruthy();
  });

  test('should not open the menu when rendering CustomValueContainer', () => {
    mockProps.selectProps.menuIsOpen = true;
    const { container, getByTestId }: RenderResult = render(<CustomValueContainer {...mockProps} />);

    const valueContainerWrapperElement: HTMLElement = getByTestId('value_container_wrapper');
    fireEvent.click(valueContainerWrapperElement);

    expect(container).toBeTruthy();
  });

  test('should activate useOutsideClick hook when the menu is open', () => {
    mockProps.selectProps.menuIsOpen = true;
    (useOutsideClick as jest.Mock).mockImplementation((ref, callback) => {
      document.addEventListener('mousedown', (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      });
    });

    render(<CustomValueContainer {...mockProps} />);
    fireEvent.mouseDown(document);

    expect(mockProps.selectProps.onMenuClose).toHaveBeenCalled();
  });

  test('should activate useOutsideClick hook when the menu is close', () => {
    (useOutsideClick as jest.Mock).mockImplementation((ref, callback) => {
      document.addEventListener('mousedown', (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      });
    });

    render(<CustomValueContainer {...mockProps} />);
    fireEvent.mouseDown(document);

    expect(mockProps.selectProps.onMenuClose).not.toHaveBeenCalled();
  });
});
