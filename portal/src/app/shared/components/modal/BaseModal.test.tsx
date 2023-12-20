/* eslint-disable @typescript-eslint/typedef */
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { BaseModalSize } from './base-modal.const';
import { ButtonActionType, ButtonSize, ButtonStyleType } from '../att-button';
import { BaseModal, BaseModalProps } from './BaseModal';

jest.mock('../att-button', );

describe('BaseModal', () => {
  test('renders modal with simple text and one button', () => {
    const handleClose = jest.fn();
    const props: BaseModalProps = {
      title: 'Test Title',
      actionButton: [{
        styleType: ButtonStyleType.PRIMARY,
        text: 'OK',
        onClick: handleClose,
        size: ButtonSize.LARGE,
        actionType: ButtonActionType.BUTTON,
      }],
      onCloseClick: jest.fn(),
      size: BaseModalSize.MEDIUM,
    };
    const { getByText }: RenderResult = render(<BaseModal {...props}>TestMe</BaseModal>);

    expect(getByText('TestMe')).toBeTruthy();
    fireEvent.click(getByText(/OK/i));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('close modal event should be raised', () => {
    const handleClose = jest.fn();
    const props: BaseModalProps = {
      title: 'Test Title',
      actionButton: [],
      onCloseClick: handleClose,
      size: BaseModalSize.MEDIUM,
    };
    const { getByRole }: RenderResult = render(<BaseModal {...props}>TestMe</BaseModal>);
    fireEvent.click(getByRole('button', { name: /Close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
