import styles from './SubHeader.module.scss';
import { useCallback } from 'react';
import { Link } from "react-router-dom";
import ArrowLeftSvg from '../../../../../../../../src/assets/images/arrow-left.svg';
import { ITestRunResult } from '../../../../../../shared/models/test-run-result.interface';
import { getAlgorithmsName, getIterations } from './utils/sub-header.utils';
import { SUB_HEADER_EN } from './translate/en';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../../../../../shared/components/att-button';
import TrashSvg from '../../../../../../../assets/images/trash.svg';
import ArrowDownSvg from '../../../../../../../assets/images/arrow-down.svg';

const DeleteAriaLabel: string = 'delete';
const DownloadAriaLabel: string = 'download';

interface SubHeaderProps {
    data: ITestRunResult;
}
export const SubHeader: React.FC<SubHeaderProps> = (props: SubHeaderProps) => {
    const { data } = props;
    const { name, description } = data;

    const handleDeleteClick: () => void = useCallback((): void => {
        console.log('handleDeleteClick');
    }, []);

    const handleDownloadClick: () => void = useCallback((): void => {
        console.log('handleDownloadClick');
    }, []);

    return (
        <div className={styles.sub_header_wrapper}>
          <div className={styles.sub_header_left_side}>
            <div className={styles.sub_header_left_side_top_section}>
                <Link className={styles.back_link} to="/qujata">
                    <img className={styles.arrow_icon} src={ArrowLeftSvg} alt="arrow" />
                    {name}
                </Link>
                <div className={styles.item_wrapper}>
                    <div className={styles.item_title}>{SUB_HEADER_EN.ALGORITHM}</div>
                    <div className={styles.item_description}>{getAlgorithmsName(data.testRuns)}</div>
                </div>
                <div className={styles.item_wrapper}>
                    <div className={styles.item_title}>{SUB_HEADER_EN.ITERATIONS}</div>
                    <div className={styles.item_description}>{getIterations(data.testRuns)}</div>
                </div>
            </div>
            <div className={styles.item_description}>{description}</div>
          </div>
          <div className={styles.sub_header_right_side}>
            <Button
                className={styles.action_button}
                ariaLabel={DownloadAriaLabel}
                size={ButtonSize.NONE}
                styleType={ButtonStyleType.WRAPPER}
                actionType={ButtonActionType.BUTTON}
                onButtonClick={handleDownloadClick}
            >
                <img className={styles.close_icon} src={ArrowDownSvg} alt={DownloadAriaLabel} />
            </Button>
            <Button
                className={styles.action_button_delete}
                ariaLabel={DeleteAriaLabel}
                size={ButtonSize.NONE}
                styleType={ButtonStyleType.WRAPPER}
                actionType={ButtonActionType.BUTTON}
                onButtonClick={handleDeleteClick}
            >
                <img className={styles.close_icon} src={TrashSvg} alt={DeleteAriaLabel} />
            </Button>
          </div>
        </div>
    );
}

