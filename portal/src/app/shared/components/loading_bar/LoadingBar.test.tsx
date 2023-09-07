import { render, RenderResult } from '@testing-library/react';
import { LoadingBar, LoadingBarProps } from './LoadingBar';

describe('LoadingBar', () => {
  test('renders LoadingBar', () => {
    const props: LoadingBarProps = {
    };
    const { container }: RenderResult = render(<LoadingBar {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
