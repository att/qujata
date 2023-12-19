import { render, waitFor, act, fireEvent } from '@testing-library/react';
import { SubHeader } from './SubHeader';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: jest.fn(({to, children}) => <div data-testid="mock-link" data-to={to}>{children}</div>),
}));

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
    testRuns: [
        {
            id:1,
            algorithm: "bikel1",
            iterations: 1000,
            results: {
              averageCPU: 3.5,
              averageMemory: 3
            }
          },
    ],
};
describe('SubHeader', () => {
    test('should render SubHeader', async () => {
      const { container } = render(<SubHeader data={mockData} />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });

    test('should click on delete icon', async () => {
        const { container, getAllByRole } = render(<SubHeader data={mockData} />);
        const trashButton = container.querySelector('.action_button_delete');
        act(() => {
            expect(getAllByRole('button')).toHaveLength(2);
            if (trashButton) {
                fireEvent.click(trashButton);
            }
        });
    });
});
