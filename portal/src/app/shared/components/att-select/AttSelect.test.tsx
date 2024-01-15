import { fireEvent, render, RenderResult } from '@testing-library/react';
import { AttSelect, AttSelectProps } from './AttSelect';
import { AttSelectOption } from './AttSelect.model';

describe('AttSelect', () => {
  test('should renders AttSelect', () => {
    const props: AttSelectProps = {
      options,
      placeholder: '',
      value: item1,
      onChange: () => expect.anything(),
    };
    const { container }: RenderResult = render(<AttSelect {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should renders EdaSelect with icon', () => {
    const props: AttSelectProps = {
      options,
      placeholder: '',
      value: item1,
      onChange: () => expect.anything(),
    };
    const { container }: RenderResult = render(<AttSelect {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders Spinner component', () => {
    const props: AttSelectProps = {
      options,
      placeholder: '',
      value: item1,
      onChange: () => expect.anything(),
      isProcessing: true,
    };
    const { container } = render(<AttSelect {...props} />);

    const spinner = container.querySelector('.att_select_spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('should open the menu when onMenuOpen is called', () => {
    const props: AttSelectProps = {
      options,
      placeholder: '',
      value: item1,
      onChange: () => expect.anything(),
      isProcessing: true,
    };
    const setMenuIsOpen = jest.fn();
    const { getByRole } = render(<AttSelect {...props} setMenuIsOpen={setMenuIsOpen} />);

    fireEvent.mouseDown(getByRole('combobox'));

    expect(setMenuIsOpen).toHaveBeenCalledWith(true);
  });

  test('should close the menu when onMenuClose is called', () => {
    const props: AttSelectProps = {
      options,
      placeholder: '',
      value: item1,
      onChange: () => expect.anything(),
      isProcessing: true,
    };
    const setMenuIsOpen = jest.fn();
    const { getByRole } = render(<AttSelect {...props} setMenuIsOpen={setMenuIsOpen} />);

    fireEvent.mouseDown(getByRole('combobox'));
    fireEvent.blur(getByRole('combobox'));

    expect(setMenuIsOpen).toHaveBeenCalledWith(false);
  });
});

const item1: AttSelectOption = {
  value: 'val1',
  label: 'label1',
};
const item2: AttSelectOption = {
  value: 'val2',
  label: 'label2',
};

const options: AttSelectOption[] = [item1, item2];
