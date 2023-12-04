import { render, waitFor } from '@testing-library/react';
import { Home } from './Home';
import { SubHeader } from '../sub-header';
import { ProtocolQuery } from '../protocol-query';

jest.mock('../sub-header');
jest.mock('../protocol-query');
jest.mock('../../hooks/useDashboardData', () => ({
  useDashboardData: () => ({
    handleRunQueryClick: jest.fn(),
    link: 'initialLink',
    status: 'idle',
  }),
}));

describe('Home', () => {
    test('should render Home', async () => {
      (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
      (ProtocolQuery as jest.Mock).mockImplementation(() => <div>ProtocolQuery</div>);
      const { container } = render(<Home />);
      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });
});
