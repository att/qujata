import { render, RenderResult } from '@testing-library/react';
import { ExperimentTabButton, ExperimentTabButtonProps } from './ExperimentTabButton';

describe('ExperimentTabButton', () => {
  test('renders ExperimentTabButton', () => {
    const experimentTabButtonProps: ExperimentTabButtonProps = {
      isSelected: true,
      onClick: jest.fn(),
      children: undefined,
    };
    
    const { container }: RenderResult = render(<ExperimentTabButton {...experimentTabButtonProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});