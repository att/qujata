import React, { ChangeEvent, PropsWithChildren } from 'react';
import cn from 'classnames';
// import { AttIcon } from 'src/styles/att-icons.enum';
import styles from './Checkbox.module.scss';

export type OnCheckboxChanged = (event: ChangeEvent<HTMLInputElement>) => void;

export interface CheckboxProps {
  isChecked: boolean;
  id: string;
  disabled?: boolean;
  className?: string;
  e2eId?: string;
  onChanged: OnCheckboxChanged;
  children?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = (props: PropsWithChildren<CheckboxProps>) => (
  <label
    className={cn(props.className, styles.checkbox_container, { [styles.checkbox_disabled]: props.disabled })}
    htmlFor={props.id}
    data-cy={props.e2eId}
  >
    <input
      type='checkbox'
      className={cn('screen-reader-input', styles.checkbox_input)}
      id={props.id}
      checked={props.isChecked}
      disabled={props.disabled}
      onChange={props.onChanged}
    />
    {/* <i
      className={cn(styles.att_checkbox_style, AttIcon.BASE_CLASS, props.isChecked ? AttIcon.CHECKBOX_SELECTED : AttIcon.CHECKBOX_NOT_SELECTED)}
      aria-hidden='true'
    /> */}
    {props.children}
  </label>
);
