/* eslint-disable @typescript-eslint/typedef */
import { render, RenderResult } from '@testing-library/react';
import { BaseModalSize } from './base-modal.const';
import { ButtonActionType, ButtonSize, ButtonStyleType } from '../att-button';
import { BaseModal, BaseModalProps } from './BaseModal';

jest.mock('../att-button', );

describe('BaseModal', () => {
  test('renders modal', async () => {
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
    };
    const { getByText }: RenderResult = render(<BaseModal {...props}>TestMe</BaseModal>);
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('TestMe')).toBeTruthy();
  });
});
