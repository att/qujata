import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react';
import { SubHeader } from './SubHeader';
import { MOCK_SUB_HEADER } from '../__mocks__/mocks';
import { FetchDataStatus, useFetch } from '../../../../../../shared/hooks/useFetch';
import { Button } from '../../../../../../shared/components/att-button';
import { EditExperimentModal, EditExperimentModalProps } from '../edit-experiment-modal';
import { DeleteExperimentModal, DeleteExperimentModalProps } from '../delete-experiment-modal';
import { mapExperimentDataToCsvDataType } from './utils/data-to-csv.util';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: jest.fn(({to, children}) => <div data-testid="mock-link" data-to={to}>{children}</div>),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useParams: () => ({
        testSuiteId: 'testSuiteId',
    }),
    // eslint-disable-next-line no-null/no-null
    Link: jest.fn().mockImplementation(() => null),
}));
jest.mock('../../../../../../shared/hooks/useFetch');
jest.mock('../../../../../../shared/components/att-button');
jest.mock('../edit-experiment-modal');
jest.mock('../delete-experiment-modal');
jest.mock('./utils/data-to-csv.util');

const mockData = MOCK_SUB_HEADER;
describe('SubHeader', () => {
    beforeEach(() => {
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [true, jest.fn()]) // for openEditModal
            .mockImplementationOnce(() => ['', jest.fn()]) // for experimentName
            .mockImplementationOnce(() => ['', jest.fn()]) // for experimentDescription
            .mockImplementationOnce(() => [true, jest.fn()]); // for openDeleteModal

        global.URL.createObjectURL = jest.fn(() => 'http://dummy.url');
        global.URL.revokeObjectURL = jest.fn(() => 'http://dummy.url');

        (Button as jest.Mock).mockImplementation(({ onButtonClick }) => {
            const handleEditNameClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
                onButtonClick(event);
            }
            const handleDownloadClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
                onButtonClick(event);
            }
            return (
                <div onClick={handleEditNameClick} data-testid='button_id'>Edit</div>
            );
        });
        (EditExperimentModal as jest.Mock).mockImplementation((props: EditExperimentModalProps) => {
            function handleCloseEditExperimentModal() {
                props.onClose({
                    name: 'test name',
                    description: 'test description'
                });
            }
            function handleCloseEditExperimentModalWithNoData() {
                props.onClose(undefined);
            }
            return (
                <>
                    <div onClick={handleCloseEditExperimentModal} data-testid='close_edit_modal'>EditExperimentModal</div>
                    <div onClick={handleCloseEditExperimentModalWithNoData} data-testid='close_edit_modal_no_data'>EditExperimentModalNoData</div>
                </>
            );
        });
        (DeleteExperimentModal as jest.Mock).mockImplementation((props: DeleteExperimentModalProps) => {
            function handleCloseDeleteExperimentModal() {
                props.onClose(true);
            }
            function handleCloseDeleteExperimentModalWithNoData() {
                props.onClose(false);
            }
            return (
                <>
                    <div onClick={handleCloseDeleteExperimentModal} data-testid='close_delete_modal'>DeleteExperimentModal</div>
                    <div onClick={handleCloseDeleteExperimentModalWithNoData} data-testid='close_delete_modal_no_data'>DeleteExperimentModalNoData</div>
                </>
            );
        });
    });

    test('should render SubHeader', async () => {
        (useFetch as jest.Mock).mockReturnValueOnce({
            delete_: jest.fn(),
            cancelRequest: jest.fn(),
            status: FetchDataStatus.Success,
        });
        (mapExperimentDataToCsvDataType as jest.Mock).mockReturnValue([
            [ 'ID', 'Algorithm', 'Iterations', 'Average CPU', 'Average Memory' ],
            [ 1, 'App1', 1000, 2000, 3000 ],
            [ 2, 'App2', 4000, 5000, 6000 ]
        ]);
        
        const { container, getAllByTestId, getByTestId } = render(<SubHeader data={mockData} />);
        const buttonElements: HTMLElement[] = getAllByTestId('button_id');
        buttonElements.forEach((element) => {
            fireEvent.click(element);
        });

        const closeEditModalElement: HTMLElement = getByTestId('close_edit_modal');
        const closeEditModalNoDataElement: HTMLElement = getByTestId('close_edit_modal_no_data');
        const closeDeleteModalElement: HTMLElement = getByTestId('close_delete_modal');
        const closeDeleteModalNoDataElement: HTMLElement = getByTestId('close_delete_modal_no_data');
        fireEvent.click(closeEditModalElement);
        fireEvent.click(closeEditModalNoDataElement);
        fireEvent.click(closeDeleteModalElement);
        fireEvent.click(closeDeleteModalNoDataElement);

        await waitFor(() => {
            expect(container).toBeTruthy();
        });
    });

    test('should click on delete icon', async () => {
        (useFetch as jest.Mock).mockReturnValueOnce({
            delete_: jest.fn(),
            cancelRequest: jest.fn(),
            status: FetchDataStatus.Fetching,
        });
        const { container } = render(<SubHeader data={mockData} />);
        const trashButton = container.querySelector('.sub_header_right_side');
        act(() => {
            if (trashButton) {
                fireEvent.click(trashButton);
            }
        });
    });
});
