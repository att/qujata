import { render, waitFor, act, fireEvent } from '@testing-library/react';
import { SubHeader } from './SubHeader';
import { MOCK_SUB_HEADER } from '../__mocks__';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: jest.fn(({to, children}) => <div data-testid="mock-link" data-to={to}>{children}</div>),
}));

const mockData = MOCK_SUB_HEADER;
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
            expect(getAllByRole('button')).toHaveLength(3);
            if (trashButton) {
                fireEvent.click(trashButton);
            }
        });
    });
});
