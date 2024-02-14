import '@testing-library/jest-dom';
import { RenderResult, render, screen } from '@testing-library/react';
import { Dashboard, DashboardProps } from './Dashboard';
import { ITestParams } from '../../shared/models/quantum.interface';

// Mock the Charts component
jest.mock('./components/charts/Charts', () => ({
  Charts: () => <div data-testid="mocked-charts" />,
}));

describe('Dashboard', () => {
  let props: DashboardProps;
  let sampleTestParams: ITestParams;
  beforeAll(() => {
    // Prepare the props for the Dashboard component
    sampleTestParams = {
      experimentName: 'test',
      algorithms: {
        label: 'Sample label',
        value: 'Sample value',
      },
      iterationsCount: {
        label: '1000',
        value: '1000',
      },
      messageSizes: {
        label: '1024',
        value: '1024'
      },
      description: 'Sample description',
    };

    const sampleData = {
      totalTime: [0.1, 0.2, 0.3],
      connectTime: [0.4, 0.5, 0.6],
      downloadSpeed: [1024, 2048, 3072],
    };

    const data = new Map();
    data.set(sampleTestParams, sampleData);

    props = { data };
  });

  test('should render Dashboard', () => {
    // Render the Dashboard component with the prepared props
    const { container }: RenderResult = render(<Dashboard {...props} />);

    // Snapshot Matching
    expect(container.firstChild).toMatchSnapshot();
  });


  test('should render Dashboard, even when values are empty', () => {
    const data = new Map();
    data.set(sampleTestParams, {});

    props = { data };

    // Render the Dashboard component with the prepared props
    const { container }: RenderResult = render(<Dashboard {...props} />);

    // Snapshot Matching
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should check all values were rendered', () => {
    // Render the Dashboard component with the prepared props
    render(<Dashboard {...props} />);

    // Assert that the mocked MainBoxes component is rendered with the correct titles
    expect(screen.getByText('Session Time - Avg (mSec)')).toBeInTheDocument();
    expect(screen.getByText('Session Handshake Time - Avg (mSec)')).toBeInTheDocument();
    expect(screen.getByText('Download Speed - Avg (kB/sec)')).toBeInTheDocument();

    // Assert that the mocked Charts component is rendered
    expect(screen.getByTestId('mocked-charts')).toBeInTheDocument();
  });
});
