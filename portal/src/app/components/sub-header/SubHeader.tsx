import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import styles from './SubHeader.module.scss';
import { SUB_HEADER_EN } from './translate/en';
import CloseSvg from '../../../assets/images/close.svg';
import ArrowDownSvg from '../../../assets/images/arrow-down-icon.svg';
import ArrowUpDownSvg from '../../../assets/images/arrow-up.svg';
import cn from 'classnames';
import { SubHeaderItems } from './constants/sub-header.const';
import { ISubHeaderItem } from './models/sub-header.interface';
import { useCallback, useState } from 'react';

const CloseAriaLabel: string = 'Close';
const ToggleAriaLabel: string = 'Toggle';

export interface SubHeaderProps {
    handleCloseClick: () => void;
}
export const SubHeader: React.FC<SubHeaderProps> = (props: SubHeaderProps) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleToggleClick: () => void = useCallback((): void => {
    setOpen((prev: boolean) => !prev);
  }, []);

  return (
    <div className={cn(styles.sub_header_wrapper, { [styles.close]: !open })}>
        <div className={cn(styles.sub_header_action_buttons, { [styles.sub_header_action_buttons_close]: !open })}>
            <Button
                className={styles.toggle_button}
                ariaLabel={CloseAriaLabel}
                size={ButtonSize.NONE}
                styleType={ButtonStyleType.WRAPPER}
                actionType={ButtonActionType.BUTTON}
                onButtonClick={handleToggleClick}
            >
                <img className={styles.arrow_icon} src={open ? ArrowUpDownSvg : ArrowDownSvg} alt={ToggleAriaLabel} />
                {SUB_HEADER_EN.TOGGLE_BUTTON}
            </Button>
            {open && <Button
                className={styles.close_button}
                ariaLabel={CloseAriaLabel}
                size={ButtonSize.NONE}
                styleType={ButtonStyleType.WRAPPER}
                actionType={ButtonActionType.BUTTON}
                onButtonClick={props.handleCloseClick}
            >
                <img className={styles.close_icon} src={CloseSvg} alt={CloseAriaLabel} />
            </Button>}
        </div>
        <div className={cn({ [styles.items_wrapper_open]: open }, { [styles.items_wrapper_close]: !open }, styles.items_wrapper)}>
            {SubHeaderItems.map((item: ISubHeaderItem, index: number) => 
                <div className={styles.item} key={item.alt}>
                    <div className={styles.item_icon_wrapper}>
                        <div className={styles.item_icon}>
                            <img src={item.icon} alt={item.alt} />
                        </div>
                        <div className={cn({[styles.sperator]: (index !== SubHeaderItems.length - 1)})} />
                    </div>
                    <div className={styles.item_description}>{item.description}</div>
                </div>
            )}
        </div>
    </div>
  );
};
