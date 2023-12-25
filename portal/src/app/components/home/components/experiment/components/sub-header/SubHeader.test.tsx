import { render, waitFor, act, fireEvent } from '@testing-library/react';
import { SubHeader } from './SubHeader';
import { MOCK_SUB_HEADER } from '../__mocks__';
import { FetchDataStatus, useFetch } from '../../../../../../shared/hooks/useFetch';
import { Button } from '../../../../../../shared/components/att-button';
import { EditExperimentModal } from '../edit-experiment-modal';
import { DeleteExperimentModal } from '../delete-experiment-modal';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: jest.fn(({to, children}) => <div data-testid="mock-link" data-to={to}>{children}</div>),
}));

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: () => ({
        testSuiteId: 'testSuiteId',
    }),
    // eslint-disable-next-line no-null/no-null
    Link: jest.fn().mockImplementation(() => null),
}));
jest.mock('../delete-experiment-modal');
jest.mock('../../../../../../shared/components/att-button');
jest.mock('../edit-experiment-modal');
jest.mock('../../../../../../shared/hooks/useFetch');

const mockData = MOCK_SUB_HEADER;
describe('SubHeader', () => {
    test('should render SubHeader', async () => {
    (Button as jest.Mock).mockImplementation(() => <div>Button</div>);
    (useFetch as jest.Mock).mockReturnValue({
        delete_: jest.fn(),
        cancelRequest: jest.fn(),
        status: FetchDataStatus.Success,
     });
     (EditExperimentModal as jest.Mock).mockImplementation(() => <div>EditExperimentModal</div>);
     (DeleteExperimentModal as jest.Mock).mockImplementation(() => <div>DeleteExperimentModal</div>);
     
      const { container } = render(<SubHeader data={mockData} />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });

    test('should click on delete icon', async () => {
        (useFetch as jest.Mock).mockReturnValue({
            delete_: jest.fn(),
            cancelRequest: jest.fn(),
            status: FetchDataStatus.Success,
         });
         (Button as jest.Mock).mockImplementation(() => <div>Button</div>);
         (EditExperimentModal as jest.Mock).mockImplementation(() => <div>EditExperimentModal</div>);
         (DeleteExperimentModal as jest.Mock).mockImplementation(() => <div>DeleteExperimentModal</div>);

        const { container } = render(<SubHeader data={mockData} />);
        const trashButton = container.querySelector('.sub_header_right_side');
        act(() => {
            if (trashButton) {
                fireEvent.click(trashButton);
            }
        });
    });
});
