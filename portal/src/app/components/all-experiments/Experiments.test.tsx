import { fireEvent, render } from '@testing-library/react';
import { Experiments } from './Experiments';
import { useExperimentsData } from './hooks';
import { FetchDataStatus, useFetch } from '../../shared/hooks/useFetch';
import React from 'react';
import { ExperimentData } from './models/experiments.interface';
import { DeleteExperimentModal, DeleteExperimentModalProps } from '../home/components/experiment/components/delete-experiment-modal';
import { Button } from '../../shared/components/att-button';
import { MOCK_DATA_FOR_ALL_EXPERIMENTS, MOCK_EXPERIMENTS_DATA_FOR_ALL_EXPERIMENTS } from './__mocks__/mocks';
import { ALL_EXPERIMENTS_TABLE_EN } from './translate/en';

jest.mock('./hooks');
jest.mock('../../shared/components/att-button');
jest.mock('../../shared/components/qujata-table');
jest.mock('../home/components/experiment/components/delete-experiment-modal');
jest.mock('../../shared/hooks/useFetch');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Experiments', () => {
  let mockCheckedRows = { 15: true, 16: false, 17: true };
  let mockExperimentsData: ExperimentData[] = MOCK_EXPERIMENTS_DATA_FOR_ALL_EXPERIMENTS;

  beforeEach(() => {
    const setExperimentsData = jest.fn((newData) => {
      (typeof newData === 'function')
        ? mockExperimentsData = newData(mockExperimentsData)
        : mockExperimentsData = newData;
    });
    const setCheckedRows = jest.fn((newData) => {
      (typeof newData === 'function')
        ? mockCheckedRows = newData(mockCheckedRows)
        : mockCheckedRows = newData;
    });
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [{ 15: true, 16: false, 17: true }, setCheckedRows])
      .mockImplementationOnce(() => [mockExperimentsData, setExperimentsData])
      .mockImplementationOnce(() => [[], jest.fn()]);

    (useFetch as jest.Mock).mockReturnValue({
      post: jest.fn(),
      status: FetchDataStatus.Success,
      error: null,
      cancelRequest: jest.fn(),
    });
    (useExperimentsData as jest.Mock).mockReturnValue({
      testSuites: MOCK_DATA_FOR_ALL_EXPERIMENTS,
      status: FetchDataStatus.Success,
    });
    (Button as jest.Mock).mockImplementation(({ onButtonClick }) => {
      const handleDeleteClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
        onButtonClick(event);
      }
      return <div onClick={handleDeleteClick} data-testid='button_id'>DeleteExperimentModal</div>;
    });
    (DeleteExperimentModal as jest.Mock).mockImplementation((props: DeleteExperimentModalProps) => {
      function handleCloseDeleteExperimentModal() {
        props.onClose(true);
      }
      function handleCloseDeleteExperimentNoDataModal() {
        props.onClose(false);
      }
      return (
        <>
          <div onClick={handleCloseDeleteExperimentModal} data-testid='delete_experiment_modal'>DeleteExperimentModal</div>
          <div onClick={handleCloseDeleteExperimentNoDataModal} data-testid='delete_experiment_no_data_modal'>DeleteExperimentModal</div>
        </>
      );
    });
  });

  test('renders Experiments correctly', () => {
    const { container, getByTestId } = render(<Experiments />);
    
    const buttonElement: HTMLElement = getByTestId('button_id');
    const deleteExperimentModal: HTMLElement = getByTestId('delete_experiment_modal');
    const deleteExperimentNoDataModal: HTMLElement = getByTestId('delete_experiment_no_data_modal');
    fireEvent.click(buttonElement);
    fireEvent.click(deleteExperimentModal);
    fireEvent.click(deleteExperimentNoDataModal);

    expect(container).toBeTruthy();
  });

  test('renders Experiments while still fetching', () => {
    (useFetch as jest.Mock).mockReturnValue({
      post: jest.fn(),
      status: FetchDataStatus.Fetching,
      error: null,
      cancelRequest: jest.fn(),
    });
    (useExperimentsData as jest.Mock).mockReturnValue({
      testSuites: undefined,
      status: FetchDataStatus.Fetching,
    });

    const { container } = render(<Experiments />);;
    expect(container).toBeTruthy();
  });
});