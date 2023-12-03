import '@testing-library/jest-dom';
import { RenderResult, render, screen } from '@testing-library/react';
import { ChartLine, ChartLineProps } from './ChartLine';

describe('ChartLine', () => {
  let props: ChartLineProps;
  beforeAll(() => {
    props = {
      title: 'Sample Title',
      data: new Map([
        ['Line 1', [1, 2, 3]],
        ['Line 2', [4, 5, 6]],
      ]),
    };
  });

  test('should render ChartLine', () => {
    // Render the ChartLine component with the prepared props
    const { container }: RenderResult = render(<ChartLine {...props} />);

    // Snapshot Matching
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should check all values were rendered', () => {
    // Render the ChartLine component with the prepared props
    render(<ChartLine {...props} />);

    // Assert that the component title is rendered
    expect(screen.getByText('Sample Title')).toBeInTheDocument();

    // Assert that the chart is rendered
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
