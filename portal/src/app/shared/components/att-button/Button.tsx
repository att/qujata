import { useCallback } from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';
import { ButtonActionType, ButtonSize, ButtonStyleType } from './Button.model';
import { ButtonCssClassBySize, ButtonCssClassByStyleType } from './Button.const';

export interface ButtonProps {
  actionType: ButtonActionType;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  size: ButtonSize;
  styleType: ButtonStyleType;
  onButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  form?: string;
  title?: string;
  e2eId?: string;

}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { onButtonClick } = props;
  const onClick: (e: React.MouseEvent<HTMLButtonElement>) => void = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.blur();
    onButtonClick(e);
  }, [onButtonClick]);

  const ButtonElement: JSX.Element = (
    <button
      className={cn(props.className, styles.button, ButtonCssClassByStyleType.get(props.styleType), ButtonCssClassBySize.get(props.size))}
      disabled={props.disabled}
      type={props.actionType}
      aria-label={props.ariaLabel}
      onClick={onClick}
      form={props.form}
      title={props.title}
      data-cy={props.e2eId}
    >
      {props.children}
    </button>
  );

  return ButtonElement;
};
