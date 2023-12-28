export const ReactModalConfig: Record<string, string> = {
  overlayClassName: 'react-modal-overlay',
  contentClassName: 'react-modal-content',
};

export enum BaseModalSize {
  EXTRA_SMALL,
  SMALL,
  MEDIUM,
  LARGE,
}

export const ModalCssClassBySize: Map<BaseModalSize, string> = new Map<BaseModalSize, string>([
  [BaseModalSize.EXTRA_SMALL, 'extra-small-modal'],
  [BaseModalSize.SMALL, 'small-modal'],
  [BaseModalSize.MEDIUM, 'medium-modal'],
  [BaseModalSize.LARGE, 'large-modal'],
]);

export const CloseAriaLabel: string = 'Close';
