import { useLayoutEffect, useState } from 'react';
import styles from './DeleteExperimentModal.module.scss';
import { BaseModal } from '../../../../../../shared/components/modal';
import { ButtonActionType, ButtonSize, ButtonStyleType, IButton } from '../../../../../../shared/components/att-button';
import { DELETE_EXPERIMENT_MODAL_EN } from './translate/en';
import { BaseModalSize } from '../../../../../../shared/components/modal/base-modal.const';

export interface DeleteExperimentModalProps {
  onClose: (confirm?: boolean) => void;
  name: string[];
}

export const DeleteExperimentModal: React.FC<DeleteExperimentModalProps> = (props: DeleteExperimentModalProps) => {
  const { name, onClose } = props;
  const [actionButtons, setActionButtons] = useState<IButton[]>([]);
  const experimentToDelete = name.map((experimentName, index) => <li key={index}>{experimentName}</li>);

  useLayoutEffect(() => {
    const submitButton: IButton = {
      styleType: ButtonStyleType.PRIMARY,
      actionType: ButtonActionType.SUBMIT,
      size: ButtonSize.LARGE,
      text: DELETE_EXPERIMENT_MODAL_EN.SUBMIT_ACTION,
      ariaLabel: DELETE_EXPERIMENT_MODAL_EN.SUBMIT_ACTION,
      className: styles.submit_button,
      onClick: (): void => onClose(true),
    };
    setActionButtons([submitButton]);
  }, [onClose]);

  return (
    <BaseModal
      title={DELETE_EXPERIMENT_MODAL_EN.TITLE}
      onCloseClick={props.onClose}
      actionButton={actionButtons}
      size={BaseModalSize.SMALL}
    >
      <div className={styles.description}>
        <p>{DELETE_EXPERIMENT_MODAL_EN.DESCRIPTION}</p>
        <ul>{experimentToDelete}</ul>
        </div>
    </BaseModal>
  );
};
