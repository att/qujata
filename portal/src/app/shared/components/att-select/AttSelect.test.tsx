import { render, RenderResult } from '@testing-library/react';
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
