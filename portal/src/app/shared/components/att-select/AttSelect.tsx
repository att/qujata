/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/ban-types */
import cn from 'classnames';
import React, { FocusEventHandler, ForwardedRef, forwardRef, ForwardRefExoticComponent, PropsWithChildren, PropsWithoutRef, RefAttributes } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Select, { ActionMeta, Options, SelectInstance } from 'react-select';
import styles from './AttSelect.module.scss';
import { AttSelectOption, AttSelectTheme } from './AttSelect.model';
import { Spinner, SpinnerSize } from '../att-spinner';
import { AttSelectCssClassByTheme } from './AttSelect.const';

export type OnSelectChangedCallbackType = (newValue: unknown, actionMeta: ActionMeta<unknown>) => void;
export type OnSelectChangedType = AttSelectOption | Options<AttSelectOption> | null;
export type OnSelectChanged = (event: OnSelectChangedType) => void;

export interface AttSelectProps {
  options: AttSelectOption[];
  value: AttSelectOption | AttSelectOption[] | undefined | null;
  required?: boolean;
  defaultValue?: AttSelectOption | AttSelectOption[];
  onChange: OnSelectChanged;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  isProcessing?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  isClearable?: boolean;
  hasError?: boolean;
  className?: string;
  placeholder?: string;
  customComponent?: {
    Option?: React.FC;
    ValueContainer?: React.FC;
    DropdownIndicator?: React.FC;
    MenuList?: React.FC;
  };
  theme?: AttSelectTheme;
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  hideSelectedOptions?: boolean;
  e2eId?: string;
  id?: string;
}

export type AttSelectExposeRef = SelectInstance;
type AttSelectPrivateType = React.ForwardRefRenderFunction<AttSelectExposeRef, AttSelectProps>;
const AttSelectPrivate: AttSelectPrivateType = (props: AttSelectProps, ref: ForwardedRef<AttSelectExposeRef>) => (
  <Select
    ref={ref}
    className={getAttSelectClassName(props)}
    classNamePrefix='att_select'
    options={props.options}
    onChange={props.onChange as OnSelectChangedCallbackType}
    onBlur={props.onBlur}
    isDisabled={props.disabled || props.readonly}
    isLoading={props.isProcessing}
    defaultValue={props.defaultValue}
    value={props.value}
    placeholder={props.placeholder}
    isMulti={props.isMulti}
    isClearable={props.isClearable}
    // menuIsOpen={true}
    closeMenuOnSelect={props.closeMenuOnSelect}
    hideSelectedOptions={props.hideSelectedOptions}
    required={props.required}
    components={{
      IndicatorSeparator,
      LoadingIndicator,
      ...(props.customComponent || {}),
    }}
    id={props.e2eId}
    inputId={props.id}
  />
);

function getAttSelectClassName(props: AttSelectProps): string {
  const { className, readonly, isProcessing, hasError, isMulti } = props;
  const theme: AttSelectTheme = props.theme || AttSelectTheme.REGULAR;
  return cn(
    'att_select_container',
    className,
    AttSelectCssClassByTheme.get(theme),
    {
      'att_select_container--is-readonly': readonly,
      'att_select_container--is-loading': isProcessing,
      att_select_multi_container: isMulti,
      [styles.att_select_error]: hasError,
    },
  );
}
function IndicatorSeparator() {
  // eslint-disable-next-line no-null/no-null
  return null;
}

function LoadingIndicator() {
  return <Spinner size={SpinnerSize.NONE} className={styles.att_select_spinner} />;
}

type AttSelectRef = ForwardRefExoticComponent<PropsWithoutRef<PropsWithChildren<AttSelectProps>> & RefAttributes<AttSelectExposeRef>>
export const AttSelect: AttSelectRef = forwardRef<AttSelectExposeRef, PropsWithChildren<AttSelectProps>>(AttSelectPrivate);
