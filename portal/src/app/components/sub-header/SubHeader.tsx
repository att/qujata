import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import styles from './SubHeader.module.scss';
import { SUB_HEADER_EN } from './translate/en';
import CloseSvg from '../../../assets/images/close.svg';
import cn from 'classnames';
import { SubHeaderItems } from './constants/sub-header.const';
import { ISubHeaderItem } from './models/sub-header.interface';

const CloseAriaLabel: string = 'Close';

export interface SubHeaderProps {
    handleCloseClick: () => void;
}
export const SubHeader: React.FC<SubHeaderProps> = (props: SubHeaderProps) => {
  return (
    <div className={styles.sub_header_wrapper}>
        <Button
            className={styles.close_button}
            ariaLabel={CloseAriaLabel}
            size={ButtonSize.NONE}
            styleType={ButtonStyleType.WRAPPER}
            actionType={ButtonActionType.BUTTON}
            onButtonClick={props.handleCloseClick}
        >
            <img className={styles.close_icon} src={CloseSvg} alt={CloseAriaLabel} />
        </Button>
        <div className={styles.sub_header_title}>{SUB_HEADER_EN.TITLE}</div>
        <div className={styles.items_wrapper}>
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
