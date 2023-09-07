import { render, RenderResult } from '@testing-library/react';
import { MulticolorIconMemoized, MulticolorIconProps } from './MulticolorIcon';

describe('MulticolorIcon', () => {
  test('renders multicolor icon with 4 nodes', () => {
    const props: MulticolorIconProps = {
      baseClass: 'eda',
      nameClass: 'xaaf-icon',
      shapesAmount: 4,
    };
    const { container }: RenderResult = render(<MulticolorIconMemoized {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not render when receive wrong size', () => {
    const props: MulticolorIconProps = {
      baseClass: 'eda',
      nameClass: 'xaaf-icon',
      shapesAmount: 0,
    };
    const { container }: RenderResult = render(<MulticolorIconMemoized {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
