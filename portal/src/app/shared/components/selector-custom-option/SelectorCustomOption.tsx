import { OptionProps, components } from 'react-select';
import styles from './SelectorCustomOption.module.scss';
import { AttSelectOption } from '../att-select';
import { algorithmSections } from '../../../components/protocol-query/constants';
import cn from 'classnames';
import CheckedSvg from '../../../../assets/images/checked.svg';
import UnCheckedSvg from '../../../../assets/images/unchecked.svg';

export type SelectorCustomOptionProps = OptionProps<AttSelectOption, true> & {
  onOptionChanged: (option: AttSelectOption) => void;
};

export const AlgorithmsSelectorCustomOption: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
  const isSectionTitle = algorithmSections.includes((props.data as AttSelectOption).value);
  const optionStyle = isSectionTitle ? styles.algorithms_input_option_title : styles.algorithms_input_option;

  return (
    <components.Option {...props}>
      <div className={styles.option_wrapper}>
        <input
          type="checkbox"
          className={styles.input_option}
          checked={props.isSelected}
          onChange={() => props.onOptionChanged} />
          <img className={optionStyle} src={props.isSelected ? CheckedSvg : UnCheckedSvg} alt="checked" />
      </div>
      <span className={optionStyle}>{props.label}</span>
    </components.Option>
  );
};

export const IterationsSelectorCustomOption: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
  return (
    <components.Option {...props}>
      <div className={styles.option_wrapper}>
        <input
          type="checkbox"
          className={cn(styles.iterations_input_option, styles.input_option)}
          checked={props.isSelected}
          onChange={() => props.onOptionChanged} />
          <img src={props.isSelected ? CheckedSvg : UnCheckedSvg} alt="checked" />
      </div>
      <span>{props.label}</span>
    </components.Option>
  );
};