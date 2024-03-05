/* eslint-disable @typescript-eslint/typedef */
import { act, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { DeleteExperimentModal, DeleteExperimentModalProps } from './DeleteExperimentModal';
import { DELETE_EXPERIMENT_MODAL_EN } from './translate/en';

describe('DeleteExperimentModal', () => {
  test('renders edit Experiment modal correctly', async () => {
    const props: DeleteExperimentModalProps = {
      name: ['Test'],
      onClose: jest.fn(),
    };
    const { container }: RenderResult = render(<DeleteExperimentModal {...props}>TestMe</DeleteExperimentModal>);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('click submit button', async () => {
    const handleClose = jest.fn();
    const props: DeleteExperimentModalProps = {
      name: ['Test'],
      onClose: handleClose,
    };
    
    const { container, getByRole, getByText }: RenderResult = render(<DeleteExperimentModal {...props}>TestMe</DeleteExperimentModal>);
    act(() => {
      fireEvent.submit(getByRole('button', { name: /Confirm/i }));
      fireEvent.click(getByText(DELETE_EXPERIMENT_MODAL_EN.SUBMIT_ACTION));
    });

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
