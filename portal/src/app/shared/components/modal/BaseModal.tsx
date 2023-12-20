import { PropsWithChildren, useCallback, ReactNode } from 'react';
import Modal from 'react-modal';
import { BaseModalSize, CloseAriaLabel, ModalCssClassBySize, ReactModalConfig } from './base-modal.const';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType, IButton } from '../att-button';
import cn from 'classnames';
import styles from './BaseModal.module.scss';
import { Spinner, SpinnerSize } from '../att-spinner';
import CloseSvg from '../../assets/images/close.svg';

export interface BaseModalProps {
    title: string;
    onCloseClick: () => void;
    actionButton?: (IButton)[];
    size?: BaseModalSize;
    showSpinner?: boolean;
}

export const BaseModal: React.FC<PropsWithChildren<BaseModalProps>> = (props: PropsWithChildren<BaseModalProps>) => {
    const { title, showSpinner, onCloseClick } = props;

    const handleCloseClick: () => void = useCallback((): void => {
      onCloseClick();
    }, [onCloseClick]);


  function renderHeader(): ReactNode {
        return (
        <h1 className={styles.title}>
            <div className={styles.modal_title_left}>
                <span data-cy='base-modal-title'>{title}</span>
            </div>
            <Button
                ariaLabel={CloseAriaLabel}
                size={ButtonSize.NONE}
                styleType={ButtonStyleType.WRAPPER}
                actionType={ButtonActionType.BUTTON}
                onButtonClick={handleCloseClick}
            >
                <img className={styles.close_icon} src={CloseSvg} alt={CloseAriaLabel} />
            </Button>
        </h1>
        );
    }

    function renderFooter(): ReactNode {
        return (
          <div className={styles.footer_container} data-cy='base-modal-footer-buttons'>
            {props.actionButton?.map((action: IButton) => (renderButtonAction(action)))}
          </div>
        );
    }

    return (
        <Modal
            isOpen
            overlayClassName={cn(ReactModalConfig.overlayClassName)}
            onRequestClose={handleCloseClick}
            className={cn(ReactModalConfig.contentClassName, ModalCssClassBySize.get(props.size as BaseModalSize))}
            contentLabel={title}
        >
          <div>
             {showSpinner && <div className={styles.modal_spinner}><Spinner size={SpinnerSize.MEDIUM} /></div>}
             {renderHeader()}
             {props.children}
             {props.actionButton?.length && renderFooter()}
          </div>
        </Modal>
    );
}

function renderButtonAction(button: IButton) {
    return (
      <Button
        key={button.text}
        actionType={button.actionType}
        size={button.size}
        styleType={button.styleType}
        onButtonClick={button.onClick}
        disabled={button.disabled}
        form={button.form}
        className={button.className}
      >
        {button.text}
      </Button>
    );
}
