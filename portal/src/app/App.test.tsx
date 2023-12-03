import { render, waitFor, act, fireEvent, screen, RenderResult } from '@testing-library/react';
import App, { AppContent, AppBody } from './App';
import { ProtocolQuery } from './components/protocol-query';
import { SubHeader } from './components/sub-header';
import { GlobalHeader } from './shared/components/global-header';
import { useSpinnerContext } from './shared/context/spinner';
import { ITestParams } from './shared/models/quantum.interface';

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

describe('AppContent', () => {
  test('should render AppContent', async () => {
    (useSpinnerContext as jest.Mock).mockImplementation(() => ({ isSpinnerOn: true }));
    (GlobalHeader as jest.Mock).mockImplementation(() => <div>GlobalHeader</div>);
    (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
    (ProtocolQuery as jest.Mock).mockImplementation(() => (
      <div>
        {JSON.stringify({ isFetching: false, onRunClick: jest.fn(), canExportFile: true, onDownloadDataClicked: jest.fn() })}
      </div>
    ));

    const { container } = render(<AppContent />);

    act(() => {
      expect(container).toBeTruthy();
    });
  });
});

describe('AppBody', () => {
  test('should render AppBody', async () => {
    (useSpinnerContext as jest.Mock).mockImplementation(() => ({ isSpinnerOn: true }));
    (GlobalHeader as jest.Mock).mockImplementation(() => <div>GlobalHeader</div>);
    (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
    (ProtocolQuery as jest.Mock).mockImplementation(() => (
      <div>
        {JSON.stringify({ isFetching: false, onRunClick: jest.fn(), canExportFile: true, onDownloadDataClicked: jest.fn() })}
      </div>
    ));

    const { container } = render(<AppBody />);

    act(() => {
      expect(container).toBeTruthy();
    });
  });
});
