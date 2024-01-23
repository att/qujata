import { noop } from 'lodash';
import React, { useCallback, useState } from 'react';
import { Options } from 'react-select';
import { ITestParams } from '../../shared/models/quantum.interface';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import { AttSelect, AttSelectOption } from '../../shared/components/att-select';
import styles from './ProtocolQuery.module.scss';
import { PROTOCOL_QUERY_EN } from './translate/en';
import { Spinner, SpinnerSize } from '../../shared/components/att-spinner';
import { useGetAlgorithms, useGetIterations, useMessageSizeData } from './hooks';
import { handleAlgorithmsSelection } from './utils';
import { AlgorithmsSelectorCustomOption, SelectorCustomOption } from '../../shared/components/selector-custom-option';
import { ExperimentData } from '../all-experiments/hooks';
import { useDuplicateData } from './hooks';

export type SelectOptionType = AttSelectOption | Options<AttSelectOption> | null;
type onTextChangedEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;
type onTextAreaChangedEvent = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type OnSelectChanged = (event: SelectOptionType) => void;

export interface ProtocolQueryProps {
  isFetching: boolean;
  onRunClick: (data: ITestParams) => void;
  duplicateData?: ExperimentData;
  setDuplicateData: (data?: ExperimentData) => void;
}

export const ProtocolQuery: React.FC<ProtocolQueryProps> = (props: ProtocolQueryProps) => {
  const { isFetching, onRunClick, duplicateData, setDuplicateData } = props;
  const { algorithmOptions, algosBySection } = useGetAlgorithms();
  
  const [experimentName, setExperimentName] = useState('');
  const [algorithms, setAlgorithms] = useState<SelectOptionType>();
  const [prevSelectedValues, setPrevSelectedValues] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  // TODO: change the variable names include "iterationsCount" word in it
  const { iterationsOptions } = useGetIterations();
  const [iterationsCount, setIterationsCount] = useState<AttSelectOption[]>([]);
  const [showIterationsInputOption, setShowIterationsInputOption] = useState(false);
  const [iterationsInputValue, setIterationsInputValue] = useState('');
  const [iterationsMenuIsOpen, setIterationsMenuIsOpen] = useState(false);

  const { messageSizeOptions } = useMessageSizeData();
  const [messageSize, setMessageSize] = useState<AttSelectOption[]>([]);
  const [showMessageSizeInputOption, setShowMessageSizeInputOption] = useState(false);
  const [messageSizeInputValue, setMessageSizeInputValue] = useState('');
  const [messageSizeMenuIsOpen, setMessageSizeMenuIsOpen] = useState(false);

  useDuplicateData({ data: duplicateData, setDuplicateData, setExperimentName, setAlgorithms, setIterationsCount, setMessageSize });

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRunClick({
      experimentName,
      algorithms: algorithms as SelectOptionType,
      iterationsCount: iterationsCount as SelectOptionType,
      messageSize: messageSize as SelectOptionType,
      description
    });
  };

  const onExperimentNameChanged: onTextChangedEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExperimentName(event.target.value);
  };

  const onAlgorithmsChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
    const { newSelectedOptions, selectedValues } = 
      handleAlgorithmsSelection(options, algorithmOptions, algosBySection, prevSelectedValues);

    setAlgorithms(newSelectedOptions);
    setPrevSelectedValues(selectedValues);
  }, [algosBySection, algorithmOptions, prevSelectedValues]);

  const onIterationsNumChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
    const selectedIterationNum: AttSelectOption[] = options as AttSelectOption[];
    setIterationsMenuIsOpen(true);
    setIterationsCount(selectedIterationNum);
  }, []);

  const onMessageSizeChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
    const selectedMessageSize: AttSelectOption[] = options as AttSelectOption[];
    setMessageSizeMenuIsOpen(true);
    setMessageSize(selectedMessageSize);
  }, []);

  const onDescriptionChanged: onTextAreaChangedEvent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  
  return (
    <div className={styles.protocol_query_wrapper}>
      <div>
        <h2 className={styles.experiment_title}>{PROTOCOL_QUERY_EN.TITLE}</h2>
        <div className={styles.note}>
          <span className={styles.note_title}>{PROTOCOL_QUERY_EN.NOTE.TITLE}</span>
          <p>{PROTOCOL_QUERY_EN.NOTE.TEXT}</p>
        </div>
      </div>
      <form className={styles.wrapper} data-testid='protocol-query-form' onSubmit={onSubmitHandler}>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.EXPERIMENT_NAME} <span className={styles.required}>{PROTOCOL_QUERY_EN.FIELDS_LABEL.REQUIRED}</span>
              </label>
              <input
                className={styles.input_form_item}
                value={experimentName}
                onChange={onExperimentNameChanged}
                placeholder=''
                required
              />
          </div>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.ALGORITHM} <span className={styles.required}>{PROTOCOL_QUERY_EN.FIELDS_LABEL.REQUIRED}</span>
              </label>
              <AttSelect
                className={styles.select_form_item}
                options={algorithmOptions}
                placeholder=''
                value={algorithms as AttSelectOption[]}
                onChange={onAlgorithmsChanged}
                isMulti
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                required
                customComponent={{ Option: AlgorithmsSelectorCustomOption as React.FC }}
              />
          </div>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.ITERATIONS_NUMBER} <span className={styles.required}>{PROTOCOL_QUERY_EN.FIELDS_LABEL.REQUIRED}</span>
              </label>
              <AttSelect
                className={styles.select_form_item}
                options={iterationsOptions}
                placeholder=''
                value={iterationsCount as AttSelectOption[]}
                onChange={onIterationsNumChanged}
                isMulti
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                menuIsOpen={iterationsMenuIsOpen}
                setMenuIsOpen={setIterationsMenuIsOpen}
                required
                customComponent={{
                  Option: (props: any) =>
                    <SelectorCustomOption
                      {...props}
                      showInputOption={showIterationsInputOption}
                      setShowInputOption={setShowIterationsInputOption}
                      inputValue={iterationsInputValue}
                      setInputValue={setIterationsInputValue}
                      setMenuIsOpen={setIterationsMenuIsOpen}
                    />
                }}
              />
          </div>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.MESSAGE_SIZE} <span className={styles.required}>{PROTOCOL_QUERY_EN.FIELDS_LABEL.REQUIRED}</span>
              </label>
              <AttSelect
                className={styles.select_form_item}
                options={messageSizeOptions}
                placeholder=''
                value={messageSize as AttSelectOption[]}
                onChange={onMessageSizeChanged}
                isMulti
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                menuIsOpen={messageSizeMenuIsOpen}
                setMenuIsOpen={setMessageSizeMenuIsOpen}
                required
                customComponent={{
                  Option: (props: any) =>
                    <SelectorCustomOption
                      {...props}
                      showInputOption={showMessageSizeInputOption}
                      setShowInputOption={setShowMessageSizeInputOption}
                      inputValue={messageSizeInputValue}
                      setInputValue={setMessageSizeInputValue}
                      setMenuIsOpen={setMessageSizeMenuIsOpen}
                    />
                }}
              />
          </div>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.DESCRIPTION}
              </label>
              <textarea
                className={styles.form_item_text_area}
                onChange={onDescriptionChanged}
                placeholder=''
              />
          </div>
          <div className={styles.submitButtonWrapper}>
              <Button
                disabled={isFetching}
                actionType={ButtonActionType.SUBMIT}
                size={ButtonSize.LARGE}
                styleType={ButtonStyleType.PRIMARY}
                onButtonClick={noop}
                className={styles.run_button}
              >
                {PROTOCOL_QUERY_EN.ACTION_BUTTONS.RUN}
              </Button>
              {isFetching && 
              <div role='status' className={styles.spinnerWrapper}>
                    <Spinner size={SpinnerSize.EXTRA_SMALL} />
                    <span className={styles.text}>{PROTOCOL_QUERY_EN.FETCH_DATA}</span>
              </div>}
          </div>
       </form>
    </div>
  );
};
