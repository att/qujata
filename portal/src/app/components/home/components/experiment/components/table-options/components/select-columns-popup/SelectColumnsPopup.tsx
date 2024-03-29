import { useCallback, useState } from 'react';
import { AttSelectOption } from '../../../../../../../../shared/components/att-select';
import styles from './SelectColumnsPopup.module.scss';
import { SELECT_COLUMNS_EN } from './translate/en';
import CloseSvg from '../../../../../../../../../assets/images/close.svg';
import CheckedSvg from '../../../../../../../../../assets/images/checked.svg';
import UnCheckedSvg from '../../../../../../../../../assets/images/unchecked.svg';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../../../../../../../shared/components/att-button';

const CloseAriaLabel: string = 'Close';

export interface SelectColumnsPopupProps {
  data: AttSelectOption[];
  onPopupClose: () => void;
  onColumnsSelected: (selectedColumns: AttSelectOption[]) => void;
  selectedColumns: AttSelectOption[];
}

export const SelectColumnsPopup: React.FC<SelectColumnsPopupProps> = (props: SelectColumnsPopupProps) => {
  const [selectedColumns, setSelectedColumns] = useState<AttSelectOption[]>(props.selectedColumns);

  const onSelectedColumnsChanged = useCallback((selected: AttSelectOption): void => {
    setSelectedColumns((prevState: AttSelectOption[]) => {
      if (prevState.find((item: AttSelectOption) => item.label === selected.label)) {
        return prevState.filter(item => item.label !== selected.label);
      } else {
        return [...prevState, selected];
      }
    });
  }, []);

  const handleSaveClick = useCallback((): void => {
    props.onPopupClose();
    props.onColumnsSelected(selectedColumns);
  }, [props, selectedColumns]);

  return (
    <div className={styles.select_columns_wrapper}>
      <div className={styles.popup_header}>
        <label className={styles.form_title}>{SELECT_COLUMNS_EN.TITLE}</label>
        <img className={styles.close_icon} src={CloseSvg} alt={CloseAriaLabel} onClick={props.onPopupClose} />
      </div>
      {props.data.map((item: AttSelectOption) => (
        <div className={styles.input_option} key={item.label}>
          <img
            data-testid={`${item.label}-checkbox-image`}
            className={styles.input_option_checkbox_icon}
            src={selectedColumns.find((selected: AttSelectOption) => selected.label === item.label) ? CheckedSvg : UnCheckedSvg}
            alt='column-option'
            onClick={() => onSelectedColumnsChanged(item)}
          />
          <input
            data-testid={`${item.label}-checkbox`}
            type='checkbox'
            id={item.label}
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
          actionType={ButtonActionType.RESET}
          size={ButtonSize.NONE}
          styleType={ButtonStyleType.WRAPPER}
          onButtonClick={() => setSelectedColumns(props.data)}
        >
          {SELECT_COLUMNS_EN.RESET_TO_DEFAULT}
        </Button>
        <Button
          className={styles.run_button}
          actionType={ButtonActionType.BUTTON}
          size={ButtonSize.SMALL}
          styleType={ButtonStyleType.PRIMARY}
          onButtonClick={handleSaveClick}
        >
          {SELECT_COLUMNS_EN.SAVE}
        </Button>
      </div>
    </div>
  );
};