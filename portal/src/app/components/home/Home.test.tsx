import { fireEvent, render, waitFor } from '@testing-library/react';
import { Home } from './Home';
import { SubHeader, SubHeaderProps } from '../sub-header';
import { ProtocolQuery, ProtocolQueryProps } from '../protocol-query';

const mockUseNavigate = jest.fn();

jest.mock('../sub-header');
jest.mock('../protocol-query');
jest.mock('../../hooks/useDashboardData', () => ({
  useDashboardData: () => ({
    handleRunQueryClick: jest.fn(),
    link: 'initialLink',
    status: 'idle',
  }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('Home', () => {
    test('should render Home', async () => {
      (SubHeader as jest.Mock).mockImplementation((props: SubHeaderProps) => {
        function onClick() {
          props.handleCloseClick();
        }
        return <div onClick={onClick} data-testid='submit-id'>SubHeader</div>;
      });
      (ProtocolQuery as jest.Mock).mockImplementation(() => <div>ProtocolQuery</div>);
      const { container, getByTestId } = render(<Home />);
      const submitButtonElement: HTMLElement = getByTestId('submit-id');

      await waitFor(() => {
        expect(container).toBeTruthy();
      });

      await waitFor(() => {
        fireEvent.click(submitButtonElement);
      });
    });

    test('should click on run button', async () => {
      (ProtocolQuery as jest.Mock).mockImplementation((props: ProtocolQueryProps) => {
        function onClick() {
          props.onRunClick({ 
            experimentName: 'test',
            algorithms: { label: 'regular', value: 'regular' },
            iterationsCount: { label: 'regular', value: 'regular' },
            description: 'test'
          });
        }
        return <div onClick={onClick} data-testid='submit-id'>SubHeader</div>;
      });
      (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
      const { container, getByTestId } = render(<Home />);
      const submitButtonElement: HTMLElement = getByTestId('submit-id');

      await waitFor(() => {
        expect(container).toBeTruthy();
      });

      await waitFor(() => {
        fireEvent.click(submitButtonElement);
      });
    });
});
