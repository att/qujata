/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { noop } from 'lodash';
import { useCallback, useState } from 'react';
import { Options } from 'react-select';
import { ITestParams } from '../../shared/models/quantum.interface';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import { AttSelect, AttSelectOption } from '../../shared/components/att-select';
import { AllAlgorithms } from './ProtocolQuery.const';
import styles from './ProtocolQuery.module.scss';

export type SelectOptionType = AttSelectOption | Options<AttSelectOption> | null;
type onTextChangedEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;

export interface ProtocolQueryProps {
  onRunClick: (data: ITestParams) => void;
  isFetching: boolean;
}

export const ProtocolQuery: React.FC<ProtocolQueryProps> = (props: ProtocolQueryProps) => {
  const { isFetching, onRunClick } = props;
  const [algorithms, setAlgorithms] = useState<SelectOptionType>([AllAlgorithms[1]]);
  const [iterationsCount, setIterationsCount] = useState<number>(10);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRunClick({ algorithms, iterationsCount });
  };

  const onAlgorithmsChanged: (options: SelectOptionType) => void = useCallback((options: SelectOptionType): void => {
    const algos: Options<AttSelectOption> = options as Options<AttSelectOption>;

    setAlgorithms(algos);
  }, []);

  const onIterationsNumChanged: onTextChangedEvent = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const val: number | string | null = +e.target.value;
    setIterationsCount(val);
  }, []);
  const algorithmsCount: number = (algorithms as AttSelectOption[]).length;
  return (
    <form className={styles.wrapper} onSubmit={onSubmitHandler}>
      <div className={styles.form_item}>
        <label>Algorithm(s) {algorithmsCount > 3 && <span className={styles.error}> 1-3 algorithm(s) can be tested</span>}</label>
        <AttSelect
          className={styles.select_form_item}
          options={AllAlgorithms}
          placeholder=''
          value={algorithms as AttSelectOption[]}
          onChange={onAlgorithmsChanged}
          isMulti
        />
      </div>
      <div className={styles.form_item}>
        <label>Number of iterations</label>
        <input
          className={styles.input_form_item}
          name='iterationNum'
          type='number'
          placeholder='10'
          min='1'
          max='50'
          value={iterationsCount}
          onChange={onIterationsNumChanged}
        />
      </div>
      {/* <div className={styles.form_item}>
        <label>Concurrent connections</label>
        <input
          className={styles.input_form_item}
          name='concurrency'
          type='number'
          placeholder='1'
          min='1'
          max='10'
          disabled
        />
      </div> */}
      <Button
        disabled={isFetching || algorithmsCount === 0 || algorithmsCount > 3}
        actionType={ButtonActionType.SUBMIT}
        size={ButtonSize.LARGE}
        styleType={ButtonStyleType.PRIMARY}
        onButtonClick={noop}
        className={styles.button}
      >
        Run
      </Button>
      {/* <Button
        disabled
        actionType={ButtonActionType.SUBMIT}
        size={ButtonSize.LARGE}
        styleType={ButtonStyleType.PRIMARY}
        onButtonClick={noop}
        className={styles.button}
      >
        Export
      </Button> */}
    </form>
  );
};
