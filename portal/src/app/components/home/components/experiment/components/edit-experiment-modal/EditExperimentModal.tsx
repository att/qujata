/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useLayoutEffect, useState } from 'react';
import styles from './EditExperimentModal.module.scss';
import { ITestRunResult } from '../../../../../../shared/models/test-run-result.interface';
import { BaseModal } from '../../../../../../shared/components/modal';
import { ButtonActionType, ButtonSize, ButtonStyleType, IButton } from '../../../../../../shared/components/att-button';
import { EDIT_EXPERIMENT_MODAL_EN } from './translate/en';
import { BaseModalSize } from '../../../../../../shared/components/modal/base-modal.const';
import cn from 'classnames';
import { replaceParams } from '../../../../../../shared/utils/replaceParams';
import { useParams } from 'react-router-dom';
import { TestRunUrlParams } from '../../../../../../shared/models/url-params.interface';
import { APIS } from '../../../../../../apis';
import { FetchDataStatus, IHttp, useFetch } from '../../../../../../shared/hooks/useFetch';
import { useErrorMessage } from '../../../../../../hooks/useErrorMessage';

export interface EditExperimentModalData {
    name: string;
    description: string;
}
export interface EditExperimentModalProps {
  onClose: (data?: EditExperimentModalData) => void;
  data: EditExperimentModalData;
}

const formID: string = 'edit-experiment-modal-form';
export const EditExperimentModal: React.FC<EditExperimentModalProps> = (props: EditExperimentModalProps) => {
  const { data, onClose } = props;
  const [name, setName] = useState<string>(data.name || '');
  const [description, setDescription] = useState<string>(data.description || '');
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const { testSuiteId } = useParams<TestRunUrlParams>();
  const testRunUrl: string = replaceParams(APIS.editExperiment, { testSuiteId });
  const { put, status: editStatus, error: editError, cancelRequest: editCancelRequest }: IHttp<FormData> = useFetch<FormData>({ url: testRunUrl });
  const [actionButtons, setActionButtons] = useState<IButton[]>([]);
  
  useErrorMessage(editError);
  

  useEffect(() => () => {
    editCancelRequest();
    setShowSpinner(false);
  }, [editCancelRequest]);

  useEffect(() => {
    setShowSpinner(editStatus === FetchDataStatus.Fetching);

    if (editStatus === FetchDataStatus.Success) {
        onClose({name, description});
    }
  }, [description, editStatus, name, onClose]);

  useLayoutEffect(() => {
    const cancelButton: IButton = {
      styleType: ButtonStyleType.TEXT,
      actionType: ButtonActionType.BUTTON,
      size: ButtonSize.LARGE,
      text: EDIT_EXPERIMENT_MODAL_EN.CANCEL_ACTION,
      ariaLabel: EDIT_EXPERIMENT_MODAL_EN.CANCEL_ACTION,
      onClick: () => { onClose(); },
    };

    const submitButton: IButton = {
      styleType: ButtonStyleType.PRIMARY,
      actionType: ButtonActionType.SUBMIT,
      size: ButtonSize.LARGE,
      text: EDIT_EXPERIMENT_MODAL_EN.SUBMIT_ACTION,
      ariaLabel: EDIT_EXPERIMENT_MODAL_EN.SUBMIT_ACTION,
      form: formID,
      onClick: (): void => undefined,
    };
    setActionButtons([cancelButton, submitButton]);
  }, [onClose]);

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    put({data: {name, description}})
  };

  return (
    <BaseModal
      title={EDIT_EXPERIMENT_MODAL_EN.TITLE}
      onCloseClick={props.onClose}
      actionButton={actionButtons}
      size={BaseModalSize.SMALL}
      showSpinner={showSpinner}
    >
      <form id={formID} data-cy={formID} onSubmit={onSubmitHandler} className={styles.form_wrapper}>
        <label className={styles.name_input}>
            <div className={cn(styles.required_input, styles.label)}>{EDIT_EXPERIMENT_MODAL_EN.FORM.LABELS.NAME}</div>
            <input className={cn(styles.form_input, styles.form_input_name)} type="text" name="name" value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
            <div className={styles.label}>{EDIT_EXPERIMENT_MODAL_EN.FORM.LABELS.DESCRIPTION}</div>
            <textarea className={cn(styles.form_input, styles.form_input_description)} rows={7} id="description" value={description} name="description" onChange={e => setDescription(e.target.value)} />
        </label>
      </form>
    </BaseModal>
  );
};
