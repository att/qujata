/* eslint-disable @typescript-eslint/typedef */
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { EditExperimentModal, EditExperimentModalProps } from './EditExperimentModal';

describe('EditExperimentModal', () => {
  test('renders edit Experiment modal correctly', () => {
    const props: EditExperimentModalProps = {
      data: { name: 'Test', description: 'description' },
      onClose: jest.fn(),
    };
    const { baseElement }: RenderResult = render(<EditExperimentModal {...props}>TestMe</EditExperimentModal>);
    expect(baseElement.firstChild).toMatchSnapshot();
  });

  test('click cancel button', () => {
    const handleClose = jest.fn();
    const props: EditExperimentModalProps = {
        data: { name: 'Test', description: 'description' },
      onClose: handleClose,
    };
    const { getByRole }: RenderResult = render(<EditExperimentModal {...props}>TestMe</EditExperimentModal>);
    fireEvent.click(getByRole('button', { name: /Cancel/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('click submit button', () => {
    const handleClose = jest.fn();
    const props: EditExperimentModalProps = {
        data: { name: 'Test', description: 'description' },
      onClose: handleClose,
    };
    const { getByRole }: RenderResult = render(<EditExperimentModal {...props}>TestMe</EditExperimentModal>);
    act(() => {
      fireEvent.submit(getByRole('button', { name: /Save/i }));
    });
  });
});
