/* eslint-disable @typescript-eslint/typedef */
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { DeleteExperimentModal, DeleteExperimentModalProps } from './DeleteExperimentModal';

describe('EditExperimentModal', () => {
  test('renders edit Experiment modal correctly', () => {
    const props: DeleteExperimentModalProps = {
      name: ['Test'],
      onClose: jest.fn(),
    };
    const { baseElement }: RenderResult = render(<DeleteExperimentModal {...props}>TestMe</DeleteExperimentModal>);
    expect(baseElement.firstChild).toMatchSnapshot();
  });

  test('click submit button', () => {
    const handleClose = jest.fn();
    const props: DeleteExperimentModalProps = {
      name: ['Test'],
      onClose: handleClose,
    };
    const { getByRole }: RenderResult = render(<DeleteExperimentModal {...props}>TestMe</DeleteExperimentModal>);
    act(() => {
      fireEvent.submit(getByRole('button', { name: /Confirm/i }));
    });
  });
});
