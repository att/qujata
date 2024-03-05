/* eslint-disable @typescript-eslint/typedef */
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { BaseModalSize } from './base-modal.const';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../att-button';
import { BaseModal, BaseModalProps } from './BaseModal';

jest.mock('../att-button', );

describe('BaseModal', () => {
  beforeEach(() => {
    (Button as jest.Mock).mockImplementation(({ onButtonClick }) => {
      const handleCloseClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
        onButtonClick(event);
      }
      return <div onClick={handleCloseClick} data-testid='close_modal'>Close</div>;
    });
  });

  test('should render BaseModal correctly', async () => {
    const handleClose = jest.fn();
    const props: BaseModalProps = {
      title: 'Test Title',
      actionButton: [{
        styleType: ButtonStyleType.PRIMARY,
        text: 'Save',
        onClick: handleClose,
        size: ButtonSize.LARGE,
        actionType: ButtonActionType.BUTTON,
      }],
      onCloseClick: jest.fn(),
      size: BaseModalSize.MEDIUM,
      showSpinner: true,
    };
    const { container, getByText, getAllByTestId }: RenderResult = render(<BaseModal {...props}>TestMe</BaseModal>);
    const closeModalButtonElements: HTMLElement[] = getAllByTestId('close_modal');

    closeModalButtonElements.forEach((element) => {
      fireEvent.click(element);
    });
    
    await waitFor(() => {
      expect(container).toBeTruthy();
      expect(getByText('Test Title')).toBeTruthy();
      expect(getByText('TestMe')).toBeTruthy();
    });
  });
});
