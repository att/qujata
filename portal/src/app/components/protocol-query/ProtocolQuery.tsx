import { noop } from 'lodash';
import { useCallback, useState } from 'react';
import { Options } from 'react-select';
import { ITestParams } from '../../shared/models/quantum.interface';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import { AttSelect, AttSelectOption } from '../../shared/components/att-select';
import { AllAlgorithms } from './ProtocolQuery.const';
import styles from './ProtocolQuery.module.scss';
import { PROTOCOL_QUERY_EN } from './translate/en';
import { QueryDefaultIterationsCount } from '../../models/query.const';

export type SelectOptionType = AttSelectOption | Options<AttSelectOption> | null;
type onTextChangedEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type OnSelectChanged = (event: SelectOptionType) => void;

export interface ProtocolQueryProps {
  isFetching: boolean;
  canExportFile?: boolean;
  onRunClick: (data: ITestParams) => void;
  onDownloadDataClicked?: () => void;
}

export const ProtocolQuery: React.FC<ProtocolQueryProps> = (props: ProtocolQueryProps) => {
  const { isFetching, canExportFile, onRunClick, onDownloadDataClicked } = props;
  const [algorithms, setAlgorithms] = useState<SelectOptionType>([AllAlgorithms[1]]);
  const [iterationsCount, setIterationsCount] = useState<number>(QueryDefaultIterationsCount);
  const algorithmsCount: number = (algorithms as AttSelectOption[]).length;

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRunClick({ algorithms, iterationsCount });
  };

  const onAlgorithmsChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
    const selectedAlgorithms: Options<AttSelectOption> = options as Options<AttSelectOption>;
    setAlgorithms(selectedAlgorithms);
  }, []);

  const onIterationsNumChanged: onTextChangedEvent = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const val: number | string | null = +e.target.value;
    setIterationsCount(val);
  }, []);

  return (
    <div className={styles.protocol_query_wrapper}>
      <form className={styles.wrapper} onSubmit={onSubmitHandler}>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.ALGORITHM} {algorithmsCount > 3 && <span className={styles.error}> {PROTOCOL_QUERY_EN.ALGORITHM_LABEL_DESCRIPTION}</span>}
              </label>
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
              <label className={styles.form_item_label}>{PROTOCOL_QUERY_EN.FIELDS_LABEL.ITERATIONS_NUMBER}</label>
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
          <Button
            disabled={isFetching || algorithmsCount === 0 || algorithmsCount > 3}
            actionType={ButtonActionType.SUBMIT}
            size={ButtonSize.LARGE}
            styleType={ButtonStyleType.PRIMARY}
            onButtonClick={noop}
            className={styles.run_button}
          >
            {PROTOCOL_QUERY_EN.ACTION_BUTTONS.RUN}
          </Button>
       </form>
       {/* <Button
            className={styles.export_button}
            actionType={ButtonActionType.BUTTON}
            size={ButtonSize.LARGE}
            styleType={ButtonStyleType.PRIMARY}
            disabled={!canExportFile}
            onButtonClick={onDownloadDataClicked}
        >
          {PROTOCOL_QUERY_EN.ACTION_BUTTONS.EXPORT}
        </Button> */}
    </div>
  );
};
