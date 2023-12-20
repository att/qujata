import { render, RenderResult } from '@testing-library/react';
import { ToggleButton, ToggleButtonProps } from './ToggleButton';

describe('ToggleButton', () => {
  test('renders ToggleButton', () => {
    const toggleButtonprops: ToggleButtonProps = {
      isSelected: true,
      onClick: jest.fn(),
      children: undefined,
    };
    const { container }: RenderResult = render(<ToggleButton {...toggleButtonprops} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});