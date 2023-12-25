import { useState } from 'react';
import { AttSelectOption } from '../../../../../../../../shared/components/att-select';
import styles from './SelectColumnsPopup.module.scss';
import { SELECT_COLUMNS_EN } from './translate/en';
import CloseSvg from '../../../../../../../../../assets/images/close.svg';
import CheckedSvg from '../../../../../../../../../assets/images/checked.svg';
import UnCheckedSvg from '../../../../../../../../../assets/images/unchecked.svg';

const CloseAriaLabel: string = 'Close';

export interface SelectColumnsPopupProps {
  data: AttSelectOption[];
  onPopupClose: () => void;
  isSelected: boolean;
}

export const SelectColumnsPopup: React.FC<SelectColumnsPopupProps> = (props: SelectColumnsPopupProps) => {
  const [selectedColumns, setSelectedColumns] = useState<AttSelectOption>();

  return (
    <div className={styles.select_columns_wrapper}>
      <div className={styles.popup_header}>
        <label className={styles.form_title}>{SELECT_COLUMNS_EN.TITLE}</label>
        <img className={styles.close_icon} src={CloseSvg} alt={CloseAriaLabel} onClick={props.onPopupClose} />
      </div>
      {props.data.map(item => (
        <div className={styles.input_option} key={item.label}>
          <input
            type='checkbox'
            id={item.value}
            className={styles.input_form_item}
            value={item.value} />
          <img src={props.isSelected ? CheckedSvg : UnCheckedSvg} />
          <label htmlFor={item.value}>{item.value}</label>
        </div>
      ))}
    </div>
  );
};