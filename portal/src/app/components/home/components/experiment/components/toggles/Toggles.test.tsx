import { render } from '@testing-library/react';
import { Toggles } from './Toggles';

describe('Toggles', () => {
  test('should render Toggles', () => {
    const { container } = render(<Toggles />);

    expect(container).toBeTruthy();
  });
});
