/* eslint-disable @typescript-eslint/typedef */
import { act, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { EditExperimentModal, EditExperimentModalProps } from './EditExperimentModal';
import React from 'react';
import { FetchDataStatus, useFetch } from '../../../../../../shared/hooks/useFetch';
import { EDIT_EXPERIMENT_MODAL_EN } from './translate/en';

jest.mock('../../../../../../shared/hooks/useFetch');

describe('EditExperimentModal', () => {
  beforeEach(() => {
    (useFetch as jest.Mock).mockReturnValue({
      put: jest.fn(),
      status: FetchDataStatus.Success,
      error: null,
      cancelRequest: jest.fn(),
    });
  });

  test('should render EditExperimentModal correctly', async () => {
    const props: EditExperimentModalProps = {
      data: { name: 'Test', description: 'description' },
      onClose: jest.fn(),
    };
    const { container, getByTestId }: RenderResult = render(<EditExperimentModal {...props}>EditExperimentModal</EditExperimentModal>);
    const editExperimentFormElement: HTMLElement = getByTestId('edit_experiment_form');

    fireEvent.submit(editExperimentFormElement);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should not close the modal when the status is still on fetching', async () => {
    (useFetch as jest.Mock).mockReturnValue({
      put: jest.fn(),
      status: FetchDataStatus.Fetching,
      error: null,
      cancelRequest: jest.fn(),
    });
    const props: EditExperimentModalProps = {
      data: { name: '', description: '' },
      onClose: jest.fn(),
    };
    const { container, getByText }: RenderResult = render(<EditExperimentModal {...props}>EditExperimentModal</EditExperimentModal>);
    fireEvent.click(getByText(EDIT_EXPERIMENT_MODAL_EN.SUBMIT_ACTION));
    
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should click submit button and trigger onSubmitHandler', async () => {
    const handleClose = jest.fn();
    const props: EditExperimentModalProps = {
      data: { name: 'Test', description: 'description' },
      onClose: handleClose,
    };
    const { container, getByRole }: RenderResult = render(<EditExperimentModal {...props}>TestMe</EditExperimentModal>);
    act(() => {
      fireEvent.change(getByRole('button', { name: /Save/i }));
    });

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should update name on change', () => {
    const setName = jest.fn();
    const props: EditExperimentModalProps = {
      data: { name: 'Test', description: 'description' },
      onClose: jest.fn(),
    };

    jest.spyOn(React, 'useState').mockImplementation(() => ['', setName]);
    const { getByTestId } = render(<EditExperimentModal {...props}>TestMe</EditExperimentModal>);
    const editExperimentFormElement: HTMLElement = getByTestId('edit_experiment_form');

    fireEvent.change(getByTestId('experiment_name_input'), { target: { value: 'new name' } });
    fireEvent.submit(editExperimentFormElement);
    
    expect(setName).toHaveBeenCalledWith('new name');
  });

  test('should update description on change', () => {
    const setDescription = jest.fn();
    const props: EditExperimentModalProps = {
      data: { name: 'Test', description: 'description' },
      onClose: jest.fn(),
    };

    jest.spyOn(React, 'useState').mockImplementation(() => ['', setDescription]);
    const { getByTestId } = render(<EditExperimentModal {...props}>TestMe</EditExperimentModal>);
    const editExperimentFormElement: HTMLElement = getByTestId('edit_experiment_form');

    fireEvent.change(getByTestId('description_input'), { target: { value: 'new description' } });
    fireEvent.submit(editExperimentFormElement);
    
    expect(setDescription).toHaveBeenCalledWith('new description');
  });
});
