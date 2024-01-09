import styles from './SelectorCustomOption.module.scss';
import cn from 'classnames';
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { GroupBase, OptionProps, components } from 'react-select';
import { AttSelectOption } from '../att-select';
import { algorithmSections } from '../../../components/protocol-query/constants';
import CheckedSvg from '../../../../assets/images/checked.svg';
import UnCheckedSvg from '../../../../assets/images/unchecked.svg';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../att-button';
import CleanSvg from '../../../../assets/images/clean.svg';

const CheckedAriaLabel: string = 'checked';
const CleanAriaLabel: string = 'clean';

export type SelectorCustomOptionProps = OptionProps<AttSelectOption<any>, true, GroupBase<AttSelectOption<any>>> & {
  onOptionChanged: (option: AttSelectOption) => void;
  showInputOption: boolean;
  setShowInputOption: (show: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  iterationsOptions: AttSelectOption[];
  setMenuIsOpen: (isOpen: boolean) => void;
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
          onChange={() => props.onOptionChanged}
        />
        <img className={optionStyle} src={props.isSelected ? CheckedSvg : UnCheckedSvg} alt={CheckedAriaLabel} />
      </div>
      <span className={optionStyle}>{props.label}</span>
    </components.Option>
  );
};

export const IterationsSelectorCustomOption: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
  return (
    <>
      {!props.data.metadata && (
        <components.Option {...props}>
          <div className={styles.option_wrapper}>
            <input
              type="checkbox"
              className={cn(styles.iterations_input_option, styles.input_option)}
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

export const CustomInput: React.FC<SelectorCustomOptionProps> = (props: SelectorCustomOptionProps) => {
  const { showInputOption, setShowInputOption, inputValue, setInputValue, iterationsOptions, setMenuIsOpen } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const cleanRef = createRef<HTMLImageElement>();
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddNewClick: () => void = useCallback((): void => {
    setShowInputOption(true);
    setInputValue('');
  }, [setShowInputOption, setInputValue]);

  const applyCustomOption: () => void = useCallback((): void => {
    const addNewOption = { label: 'Add New', value: 'Add New', metadata: { isInput: true }};
    delete props.data.metadata;
    const addNewIndex = iterationsOptions.findIndex(option => option.metadata?.isAddNewButton);
    const newIterationsOptions = [...iterationsOptions];
    newIterationsOptions.splice(addNewIndex, 0, addNewOption);
    setShowInputOption(false);
  }, [iterationsOptions, setShowInputOption, props]);

  const handleCustomOptionClean: () => void = useCallback((): void => {
    cleanRef.current?.focus();
    setInputValue('');
  }, [cleanRef, setInputValue]);

  useEffect(() => {
    if (showInputOption && props.data.metadata?.isInput) {
      inputRef.current?.focus();
      props.data.label = inputValue;
      props.data.value = inputValue;
    }
  }, [showInputOption, props, inputValue]);

  return (
    <>
      {showInputOption && props.data.metadata?.isInput && (
        <components.Option {...props}>
          <div className={styles.add_new_wrapper}>
            <div className={styles.add_new_checkbox_wrapper}>
              <input
                type="checkbox"
                className={cn(styles.iterations_input_option, styles.input_option)}
                checked={props.isSelected}
                onChange={() => props.onOptionChanged}
              />
              <img src={props.isSelected ? CheckedSvg : UnCheckedSvg} alt={CheckedAriaLabel} />
            </div>
            <div className={styles.input_wrapper}>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setMenuIsOpen(true)}
                className={styles.add_new_input_option}
                disabled={!props.isSelected}
              />
              {inputValue !== '' && (
                <>
                  <img
                    className={styles.clean_icon}
                    ref={cleanRef}
                    onClick={handleCustomOptionClean}
                    src={CleanSvg}
                    alt={CleanAriaLabel}
                  />
                  <Button
                    className={styles.plus_button}
                    ariaLabel={props.label}
                    size={ButtonSize.NONE}
                    styleType={ButtonStyleType.WRAPPER}
                    actionType={ButtonActionType.BUTTON}
                    onButtonClick={applyCustomOption}
                  >+</Button>
                </>
              )}

            </div>
          </div>
        </components.Option>
      )}
      {props.data.metadata?.isAddNewButton && (
        <Button
          className={styles.add_new_button}
          ariaLabel={props.label}
          size={ButtonSize.NONE}
          styleType={ButtonStyleType.WRAPPER}
          actionType={ButtonActionType.BUTTON}
          onButtonClick={handleAddNewClick}
          disabled={showInputOption}
        >
          <span>{props.label}</span>
        </Button>
      )}
    </>
  );
}