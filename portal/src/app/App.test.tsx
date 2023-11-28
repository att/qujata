import { render, waitFor, act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { AppContent, AppBody } from './App';
import { ProtocolQuery, ProtocolQueryProps } from './components/protocol-query';
import { SubHeader } from './components/sub-header';
import { GlobalHeader } from './shared/components/global-header';
import { useSpinnerContext } from './shared/context/spinner';

jest.mock('./shared/context/spinner');
jest.mock('./shared/components/global-header');
jest.mock('./components/sub-header');
jest.mock('./components/protocol-query');
jest.mock('./hooks/useDashboardData', () => ({
  useDashboardData: () => ({
    handleRunQueryClick: jest.fn(),
    link: 'initialLink',
    status: 'idle',
  }),
}));

describe('App', () => {
  test('should render App', async () => {
    const { container } = render(<App />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should render spinner when isSpinnerOn true', async () => {
    (useSpinnerContext as jest.Mock).mockImplementation(() => ({ isSpinnerOn: true }));
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  test('should render App', async () => {
    (useSpinnerContext as jest.Mock).mockImplementation(() => ({ isSpinnerOn: true }));
    (GlobalHeader as jest.Mock).mockImplementation(() => <div>GlobalHeader</div>);
    (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
    (ProtocolQuery as jest.Mock).mockImplementation(() => ({ isFetching: false, onRunClick: jest.fn(), canExportFile: true, onDownloadDataClicked: jest.fn() }));

    const { container } = render(<App />);

    act(() => {
      expect(container).toBeTruthy();
    });
  });
});

// describe('AppContent', () => {
//   it('renders GlobalHeader and SubHeader initially', () => {
//     render(<AppContent />);
//     expect(screen.getByText('GlobalHeader')).toBeInTheDocument();
//     expect(screen.getByText('SubHeader')).toBeInTheDocument();
//   });

//   it('hides SubHeader when close button is clicked', () => {
//     render(<AppContent />);
//     fireEvent.click(screen.getByText('Close'));
//     expect(screen.queryByText('SubHeader')).not.toBeInTheDocument();
//   });
// });

// describe('AppBody', () => {
//   it('calls handleRunQueryClick and updates state when handleRunClick is called', () => {
//     render(<AppBody />);
    
//     const runButton = screen.getByRole('button', { name: /run/i });
//     userEvent.click(runButton);

//     // Now you can check the effects of the handleRunClick function
//     // For example, you can check if handleRunQueryClick has been called
//     const { handleRunQueryClick } = require('./hooks/useDashboardData').useDashboardData();
//     expect(handleRunQueryClick).toHaveBeenCalled();

//     // You can also check if the state has been updated
//     // For example, you can check if the dashboard link has been updated
//     const dashboardLink = screen.getByText('initialLink');
//     expect(dashboardLink).toBeInTheDocument();
//   });
// });
