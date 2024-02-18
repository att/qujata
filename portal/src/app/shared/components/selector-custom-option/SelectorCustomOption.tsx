import styles from './SelectorCustomOption.module.scss';
import cn from 'classnames';
import { GroupBase, OptionProps, components } from 'react-select';
import { AttSelectOption } from '../att-select';
import { algorithmSections } from '../../../components/protocol-query/constants';
import CheckedSvg from '../../../../assets/images/checked.svg';
import UnCheckedSvg from '../../../../assets/images/unchecked.svg';
import { CustomInput } from './components';

const CheckedAriaLabel: string = 'checked';

export type SelectorCustomOptionProps = OptionProps<AttSelectOption<any>, true, GroupBase<AttSelectOption<any>>> & {
  onOptionChanged: (option: AttSelectOption) => void;
  showInputOption: boolean;
  setShowInputOption: (show: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  setMenuIsOpen: (isOpen: boolean) => void;
};

export const AlgorithmsSelectorCustomOption: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
  const isSectionTitle = algorithmSections.includes((props.data as AttSelectOption).value);
  const optionStyle = isSectionTitle ? styles.algorithms_input_option_title : styles.algorithms_input_option;

  return (
    <components.Option {...props}>
      <div className={styles.option_wrapper}>
        <input
          id={props.label}
          type="checkbox"
          className={styles.input_option}
          checked={props.isSelected}
          onChange={() => props.onOptionChanged}
        />
        <img className={optionStyle} src={props.isSelected ? CheckedSvg : UnCheckedSvg} alt={CheckedAriaLabel} />
      </div>
      <span className={optionStyle}>{props.label}</span>
    </components.Option>
  );
};

export const SelectorCustomOption: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
  return (
    <>
      {!props.data.metadata && (
        <components.Option {...props}>
          <div className={styles.option_wrapper}>
            <input
              id={props.label}
              type="checkbox"
              className={cn(styles.custom_input_option, styles.input_option)}
              checked={props.isSelected}
              onChange={() => props.onOptionChanged}
            />
            <img src={props.isSelected ? CheckedSvg : UnCheckedSvg} alt={CheckedAriaLabel} />
          </div>
          <span>{props.label}</span>
        </components.Option>
      )}
      <CustomInput {...props} />
    </>
  );
};
