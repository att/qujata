import styles from './TableOptions.module.scss';
import cn from 'classnames';
import { TABLE_OPTIONS_EN } from './translate/en';
import SelectColumnsSvg from '../../../../../../../assets/images/select-columns.svg';
import SelectColumnsCheckedSvg from '../../../../../../../assets/images/select-columns-checked.svg';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../../../../../shared/components/att-button';

const SelectColumnsAriaLabel: string = TABLE_OPTIONS_EN.SELECT_COLUMNS;

export interface TableOptionsProps {
  handleSelectColumnsClick: () => void;
  isPopupOpen: boolean;
}

export const TableOptions: React.FC<TableOptionsProps> = (props: TableOptionsProps) => {
  return (
    <div className={styles.table_options_wrapper}>
      <Button
        ariaLabel={SelectColumnsAriaLabel}
        size={ButtonSize.NONE}
        styleType={ButtonStyleType.WRAPPER}
        actionType={ButtonActionType.BUTTON}
        onButtonClick={props.handleSelectColumnsClick}
      >
        <div className={styles.option_wrapper}>
          <img className ={cn(styles.option_image, styles.default_image)} src={SelectColumnsSvg} alt={SelectColumnsAriaLabel} />
          <img className ={cn(styles.option_image, styles.hover_image)} src={SelectColumnsCheckedSvg} alt={SelectColumnsAriaLabel} />
          <span className={styles.option_text}>{TABLE_OPTIONS_EN.SELECT_COLUMNS}</span>
        </div>
      </Button>
    </div>
  );
};
