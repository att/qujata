import { useCallback, useEffect, useState } from 'react';
import { noop } from 'lodash';
import { AttSelectOption } from '../../../../../../../../shared/components/att-select';
import styles from './SelectColumnsPopup.module.scss';
import { SELECT_COLUMNS_EN } from './translate/en';
import CloseSvg from '../../../../../../../../../assets/images/close.svg';
import CheckedSvg from '../../../../../../../../../assets/images/checked.svg';
import UnCheckedSvg from '../../../../../../../../../assets/images/unchecked.svg';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../../../../../../../shared/components/att-button';

const CloseAriaLabel: string = 'Close';
const ResetAriaLabel: string = 'Reset to default';

export interface SelectColumnsPopupProps {
  data: AttSelectOption[];
  onPopupClose: () => void;
  isSelected: boolean;
}

export const SelectColumnsPopup: React.FC<SelectColumnsPopupProps> = (props: SelectColumnsPopupProps) => {
  const [selectedColumns, setSelectedColumns] = useState<AttSelectOption[]>(props.data);

  const onSelectedColumnsChanged = useCallback((selected: AttSelectOption): void => {
    setSelectedColumns((prevState: AttSelectOption[]) => {
      if (prevState.find((item: AttSelectOption) => item.value === selected.value)) {
        return prevState.filter(item => item.value !== selected.value);
      } else {
        return [...prevState, selected];
      }
    });
  }, []);

  useEffect(() => {
    console.log('selectedColumns', selectedColumns);
  }, [selectedColumns]);

  return (
    <form className={styles.select_columns_wrapper} onSubmit={() => {}}>
      <div className={styles.popup_header}>
        <label htmlFor={props.data[0].label} className={styles.form_title}>{SELECT_COLUMNS_EN.TITLE}</label>
        <img className={styles.close_icon} src={CloseSvg} alt={CloseAriaLabel} onClick={props.onPopupClose} />
      </div>
      {props.data.map((item: AttSelectOption) => (
        <div className={styles.input_option} key={item.label}>
          <img
            className={styles.input_option_checkbox_icon}
            src={selectedColumns.find((selected: AttSelectOption) => selected.value === item.value) ? CheckedSvg : UnCheckedSvg}
            alt='checked-unchecked'
            onClick={() => onSelectedColumnsChanged(item)}
          />
          <input
            type='checkbox'
            id={item.value}
            className={styles.input_form_item}
            onChange={() => onSelectedColumnsChanged(item)}
            value={item.value}
          />
          <label className={styles.input_option_label} htmlFor={item.label}>{item.value}</label>
        </div>
      ))}
      <div className={styles.popup_footer}>
        <Button
          className={styles.reset_button}
          ariaLabel={ResetAriaLabel}
          size={ButtonSize.NONE}
          styleType={ButtonStyleType.WRAPPER}
          actionType={ButtonActionType.RESET}
          onButtonClick={() => {}}
        >
          {SELECT_COLUMNS_EN.RESET_TO_DEFAULT}
        </Button>
        <Button
          className={styles.run_button}
          actionType={ButtonActionType.SUBMIT}
          size={ButtonSize.SMALL}
          styleType={ButtonStyleType.PRIMARY}
          onButtonClick={noop}
        >
          {SELECT_COLUMNS_EN.SAVE}
        </Button>
      </div>
    </form>
  );
};