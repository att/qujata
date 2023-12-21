import { render } from '@testing-library/react';
import { Toggles, TogglesProps } from './Toggles';

describe('Toggles', () => {
  const togglesProps: TogglesProps = {
    currentSection: 'Results Data',
    handleButtonClick: jest.fn(),
  };
  
  test('should render Toggles', () => {
    const { container } = render(<Toggles {...togglesProps} />);

    expect(container).toBeTruthy();
  });
});
