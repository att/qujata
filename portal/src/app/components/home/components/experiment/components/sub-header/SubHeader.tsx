import styles from './SubHeader.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowLeftSvg from '../../../../../../../../src/assets/images/arrow-left.svg';
import { ITestRunResult } from '../../../../../../shared/models/test-run-result.interface';
import { getAlgorithmsName, getIterations } from './utils/sub-header.utils';
import { SUB_HEADER_EN } from './translate/en';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../../../../../shared/components/att-button';
import TrashSvg from '../../../../../../../assets/images/trash.svg';
import ArrowDownSvg from '../../../../../../../assets/images/arrow-down.svg';
import { mapExperimentDataToCsvDataType } from './utils/data-to-csv.util';
import { downloadCsvFile } from '../../../../../../utils/download';
import PencilSvg from '../../../../../../../assets/images/pencil.svg';
import { EditExperimentModal, EditExperimentModalData } from '../edit-experiment-modal';
import { DeleteExperimentModal } from '../delete-experiment-modal';
import { FetchDataStatus, IHttp, useFetch } from '../../../../../../shared/hooks/useFetch';
import { TestRunUrlParams } from '../../../../../../shared/models/url-params.interface';
import { replaceParams } from '../../../../../../shared/utils/replaceParams';
import { APIS } from '../../../../../../apis';
import { useFetchSpinner } from '../../../../../../shared/hooks/useFetchSpinner';
import { useErrorMessage } from '../../../../../../hooks/useErrorMessage';

const DeleteAriaLabel: string = 'delete';
const DownloadAriaLabel: string = 'download';
const EditAriaLabel: string = 'edit';

interface SubHeaderProps {
    data: ITestRunResult;
}
export const SubHeader: React.FC<SubHeaderProps> = (props: SubHeaderProps) => {
    const { data } = props;
    const { name, description } = data;
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [experimentName, setExperimentName] = useState<string>(name || '');
    const [experimentDescription, setExperimentDescription] = useState<string>(description || '');
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const { testSuiteId } = useParams<TestRunUrlParams>();
    const url: string = replaceParams(APIS.deleteExperiment, { testSuiteId });
    const { error: deleteError, delete_, status: deleteStatus, cancelRequest: cancelRequestDelete }: IHttp<unknown> = useFetch<unknown>({ url });
    const navigate = useNavigate();

    useFetchSpinner(deleteStatus);
    useErrorMessage(deleteError);

    useEffect(() => {
        return cancelRequestDelete;
    }, [cancelRequestDelete]);

    useEffect(() => {
        if (deleteStatus === FetchDataStatus.Success) {
            navigate('/qujata');
        }
    }, [deleteStatus, navigate]);

    const handleEditNameClick: () => void = useCallback((): void => {
        setOpenEditModal(true);
    }, []);

    const handleDeleteClick: () => void = useCallback((): void => {
        setOpenDeleteModal(true);
    }, []);

    const handleDownloadClick: () => void = useCallback((): void => {
        const csvFileName: string = `${SUB_HEADER_EN.CSV_REPORT.FILE_NAME}-${name || ''}.csv`;
        downloadCsvFile(mapExperimentDataToCsvDataType(data.test_runs), csvFileName);
    }, [data.test_runs, name]);
    
    const handleCloseEditExperimentModal: (editData?: EditExperimentModalData) => void = useCallback((editData?: EditExperimentModalData): void => {
        if (editData) {
            setExperimentName(editData.name);
            setExperimentDescription(editData.description);
        }
        setOpenEditModal(false);
    }, []);

    const handleCloseDeleteExperimentModal: (confirm?: boolean) => void = useCallback((confirm?: boolean): void => {
        if (confirm) {
            delete_();
        }
        setOpenDeleteModal(false);
    }, [delete_]);

    return (
        <>
          <div className={styles.sub_header_wrapper}>
            <div className={styles.sub_header_left_side}>
                <div className={styles.sub_header_left_side_top_section}>
                    <div className={styles.name_wrapper}>
                        <Link className={styles.back_link} to="/qujata">
                            <img className={styles.arrow_icon} src={ArrowLeftSvg} alt="arrow" />
                            {experimentName}
                        </Link>
                        <Button
                            className={styles.action_button_edit}
                            ariaLabel={EditAriaLabel}
                            size={ButtonSize.NONE}
                            styleType={ButtonStyleType.WRAPPER}
                            actionType={ButtonActionType.BUTTON}
                            onButtonClick={handleEditNameClick}
                        >
                            <img className={styles.close_icon} src={PencilSvg} alt={EditAriaLabel} />
                        </Button>
                    </div>
                    <div className={styles.item_wrapper}>
                        <div className={styles.item_title}>{SUB_HEADER_EN.ALGORITHM}</div>
                        <div className={styles.item_description}>{getAlgorithmsName(data.test_runs)}</div>
                    </div>
                    <div className={styles.item_wrapper}>
                        <div className={styles.item_title}>{SUB_HEADER_EN.ITERATIONS}</div>
                        <div className={styles.item_description}>{getIterations(data.test_runs)}</div>
                    </div>
                </div>
                <div className={styles.item_description}>{experimentDescription}</div>
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
          {openEditModal && <EditExperimentModal data={{name: experimentName, description: experimentDescription}} onClose={handleCloseEditExperimentModal} />}
          {openDeleteModal && <DeleteExperimentModal name={experimentName} onClose={handleCloseDeleteExperimentModal} />}
        </>
    );
}

