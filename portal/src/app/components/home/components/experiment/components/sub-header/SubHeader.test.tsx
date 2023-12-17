import { render, waitFor } from '@testing-library/react';
import { SubHeader } from './SubHeader';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: jest.fn(({to, children}) => <div data-testid="mock-link" data-to={to}>{children}</div>),
}));

describe('SubHeader', () => {
    test('should render SubHeader', async () => {
      const { container } = render(<SubHeader linkTitle='linkTitle' />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });
});
