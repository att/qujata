export enum ButtonActionType {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset',
}

export enum ButtonStyleType {
  PRIMARY,
  SECONDARY,
  TEXT,
  WRAPPER,
}

export enum ButtonSize {
  SMALL,
  MEDIUM,
  LARGE,
  NONE,
}

export interface IButton {
  size: ButtonSize;
  styleType: ButtonStyleType;
  actionType: ButtonActionType;
  className?: string;
  disabled?: boolean;
  text: string;
  ariaLabel?: string;
  form?: string;
  e2eId?: string;
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}
