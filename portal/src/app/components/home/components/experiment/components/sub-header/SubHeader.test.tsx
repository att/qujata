import { render, waitFor } from '@testing-library/react';
import { SubHeader } from './SubHeader';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: jest.fn(({to, children}) => <div data-testid="mock-link" data-to={to}>{children}</div>),
}));

describe('SubHeader', () => {
    test('should render SubHeader', async () => {
      const mockData = {
        id: 1,
        name: 'name',
        description: 'name',
        start_time: 'name',
        end_time: 'name',
        environment_info: {
            codeRelease: 'codeRelease',
            cpu: 'codeRelease',
            cpuArchitecture: 'codeRelease',
            cpuClockSpeed: 'codeRelease',
            cpuCores: 2,
            nodeSize: 'codeRelease',
            operatingSystem: 'codeRelease',
            resourceName: 'codeRelease',
        },
        testRuns: [],
      };
      const { container } = render(<SubHeader data={mockData} />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });
});
