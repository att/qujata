import { fireEvent, render, waitFor } from '@testing-library/react';
import { Home } from './Home';
import { SubHeader, SubHeaderProps } from '../sub-header';
import { ProtocolQuery, ProtocolQueryProps } from '../protocol-query';
import { useDashboardData } from '../../hooks/useDashboardData';
import { FetchDataStatus } from '../../shared/hooks/useFetch';

const mockUseNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('../sub-header');
jest.mock('../protocol-query');
jest.mock('../../hooks/useDashboardData');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation,
}));

describe('Home', () => {
  beforeEach(() => {
    (useDashboardData as jest.Mock).mockReturnValue({
      handleRunQueryClick: jest.fn(),
      link: 'initialLink',
      status: FetchDataStatus.Success,
      testSuiteId: 'testSuiteId',
    });
  });

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
      fireEvent.click(submitButtonElement);
    });

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should click on run button', async () => {
    (ProtocolQuery as jest.Mock).mockImplementation((props: ProtocolQueryProps) => {
      function onClick() {
        props.onRunClick({ 
          experimentName: 'test',
          algorithms: { label: 'regular', value: 'regular' },
          iterationsCount: { label: 'regular', value: 'regular' },
          messageSizes: [{ label: '1024', value: '1024' }],
          description: 'test'
        });
      }
      function onClickNotEnoughData() {
        props.onRunClick({ 
          experimentName: '',
          algorithms: { label: 'regular', value: 'regular' },
          iterationsCount: { label: 'regular', value: 'regular' },
          messageSizes: [],
          description: 'test'
        });
      }
      return (
        <>
          <div onClick={onClick} data-testid='submit'>ProtocolQuery</div>
          <div onClick={onClickNotEnoughData} data-testid='submit_not_enough_data'>ProtocolQuery</div>
        </>
      );
    });
    (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
    const { container, getByTestId } = render(<Home />);
    const submitButtonElement: HTMLElement = getByTestId('submit');
    const submitNotEnoughDataButtonElement: HTMLElement = getByTestId('submit_not_enough_data');

    fireEvent.click(submitButtonElement);
    fireEvent.click(submitNotEnoughDataButtonElement);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
