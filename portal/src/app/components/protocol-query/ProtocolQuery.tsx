import { noop } from 'lodash';
import { useCallback, useState } from 'react';
import { Options } from 'react-select';
import { ITestParams } from '../../shared/models/quantum.interface';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import { AttSelect, AttSelectOption } from '../../shared/components/att-select';
import styles from './ProtocolQuery.module.scss';
import { PROTOCOL_QUERY_EN } from './translate/en';
import { Spinner, SpinnerSize } from '../../shared/components/att-spinner';
import { useGetAlgorithms, useGetIterations } from './hooks';

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
  const { options } = useGetAlgorithms();
  const { iterationsOptions } = useGetIterations();
  const [algorithms, setAlgorithms] = useState<SelectOptionType>();
  const [iterationsCount, setIterationsCount] = useState<SelectOptionType>();

  const algorithmsCount: number = (algorithms as AttSelectOption[])?.length;

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRunClick({ algorithms: algorithms as SelectOptionType, iterationsCount: iterationsCount as SelectOptionType });
  };

  const onAlgorithmsChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
    const selectedAlgorithms: Options<AttSelectOption> = options as Options<AttSelectOption>;
    setAlgorithms(selectedAlgorithms);
  }, []);

  const onIterationsNumChanged: OnSelectChanged = useCallback((options: SelectOptionType): void => {
    const selectedIterationNum: Options<AttSelectOption> = options as Options<AttSelectOption>;
    setIterationsCount(selectedIterationNum);
  }, []);

  return (
    <div className={styles.protocol_query_wrapper}>
      <form className={styles.wrapper} data-testid='protocol-query-form' onSubmit={onSubmitHandler}>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>
                {PROTOCOL_QUERY_EN.FIELDS_LABEL.ALGORITHM} {algorithmsCount > 3 && <span className={styles.error}> {PROTOCOL_QUERY_EN.ALGORITHM_LABEL_DESCRIPTION}</span>}
              </label>
              <AttSelect
                className={styles.select_form_item}
                options={options}
                placeholder=''
                value={algorithms as AttSelectOption[]}
                onChange={onAlgorithmsChanged}
                isMulti
                required
              />
          </div>
          <div className={styles.form_item}>
              <label className={styles.form_item_label}>{PROTOCOL_QUERY_EN.FIELDS_LABEL.ITERATIONS_NUMBER}</label>
              <AttSelect
                className={styles.select_form_item}
                options={iterationsOptions}
                placeholder=''
                value={iterationsCount as AttSelectOption}
                onChange={onIterationsNumChanged}
                required
              />
          </div>
          <div className={styles.submitButtonWrapper}>
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
              {isFetching && 
              <div role='status' className={styles.spinnerWrapper}>
                    <Spinner size={SpinnerSize.EXTRA_SMALL} />
                    <span className={styles.text}>{PROTOCOL_QUERY_EN.FETCH_DATA}</span>
              </div>}
          </div>
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
