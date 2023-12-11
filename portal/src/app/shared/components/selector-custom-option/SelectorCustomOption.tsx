import { OptionProps, components } from 'react-select';
import styles from './SelectorCustomOption.module.scss';
import { AttSelectOption } from '../att-select';
import { algorithmSections } from '../../../components/protocol-query/constants';

export type SelectorCustomOptionProps = OptionProps<AttSelectOption, true> & {
  onOptionChanged: (option: AttSelectOption) => void;
};

export const AlgorithmsSelectorCustomOption: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
  const isSectionTitle = algorithmSections.includes((props.data as AttSelectOption).value);
  const optionStyle = isSectionTitle ? styles.algorithms_input_option_title : styles.algorithms_input_option;

  return (
    <components.Option {...props}>
      <div>
        <input
          type="checkbox"
          className={optionStyle}
          checked={props.isSelected}
          onChange={() => props.onOptionChanged} />
      </div>
      <span>{props.label}</span>
    </components.Option>
  );
};

export const IterationsSelectorCustomOption: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
  return (
    <components.Option {...props}>
      <div>
        <input
          type="checkbox"
          className={styles.iterations_input_option}
          checked={props.isSelected}
          onChange={() => props.onOptionChanged} />
      </div>
      <span>{props.label}</span>
    </components.Option>
  );
};