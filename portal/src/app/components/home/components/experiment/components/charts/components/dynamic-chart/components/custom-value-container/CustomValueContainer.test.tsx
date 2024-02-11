import { render, RenderResult } from '@testing-library/react';
import { CustomValueContainer } from './CustomValueContainer';
import { GroupBase, SetValueAction, ValueContainerProps } from 'react-select';
import { AttSelectOption } from '../../../../../../../../../../shared/components/att-select';

describe('CustomValueContainer', () => {
    const mockProps: ValueContainerProps<AttSelectOption<any>, boolean, GroupBase<AttSelectOption<any>>> = {
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
      selectProps: undefined as any,
      setValue: jest.fn(),
      theme: undefined as any
  };

  it('should render CustomValueContainer', () => {
    const { container }: RenderResult = render(<CustomValueContainer {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
