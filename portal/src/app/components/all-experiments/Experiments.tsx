import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Experiments.module.scss';
import cn from 'classnames';
import { IUseExperimentsData, useExperimentsData } from './hooks';
import { FetchDataStatus, IHttp, useFetch } from '../../shared/hooks/useFetch';
import { ALL_EXPERIMENTS_TABLE_EN } from './translate/en';
import { CellContext } from '@tanstack/react-table';
import { Table } from '../../shared/components/table';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import { APIS } from '../../apis';
import { useNavigate } from 'react-router-dom';
import { useFetchSpinner } from '../../shared/hooks/useFetchSpinner';
import { useErrorMessage } from '../../hooks/useErrorMessage';
import { formatDistanceToNow } from 'date-fns';
import CheckedSvg from '../../../assets/images/checked.svg';
import UnCheckedSvg from '../../../assets/images/unchecked.svg';
import TrashSvg from '../../../assets/images/trash.svg';
import TrashHoverSvg from '../../../assets/images/trash-hover.svg';
import DuplicateSvg from '../../../assets/images/duplicate.svg';
import { DeleteExperimentModal } from '../home/components/experiment/components/delete-experiment-modal';
import { parseExperimentsData } from './utils/parse-experiments-data.utils';
import { ExperimentData } from './models/experiments.interface';

const DeleteAriaLabel: string = ALL_EXPERIMENTS_TABLE_EN.BUTTONS.DELETE;
const DuplicateAriaLabel: string = ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.LINKS.DUPLICATE;

export const Experiments: React.FC = () => {
  const navigate = useNavigate();
  const { testSuites, status }: IUseExperimentsData = useExperimentsData();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [checkedRows, setCheckedRows] = useState<Record<number, boolean>>({});
  const [experimentsData, setExperimentsData] = useState<ExperimentData[]>([]);
  const [itemsToDelete, setItemsToDelete] = useState<ExperimentData[]>([]);

  const { post, status: deleteStatus, error: deleteError, cancelRequest: cancelRequestDelete }: IHttp<unknown>
    = useFetch<unknown>({ url: APIS.deleteExperiments });
  useFetchSpinner(deleteStatus);
  useErrorMessage(deleteError);
  useEffect(() => cancelRequestDelete, [cancelRequestDelete]);

  // Update the experimentsData state when testSuites changes
  useEffect(() => {
    if (testSuites) {
      setExperimentsData(parseExperimentsData(testSuites));
    }
  }, [testSuites]);

  // Update the experimentsData state when delete operation is successful
  useEffect(() => {
    if (deleteStatus === FetchDataStatus.Success) {
      setExperimentsData(prevExperimentsData => prevExperimentsData.filter(experiment => !itemsToDelete.includes(experiment)));
      setCheckedRows({});
    }
  }, [deleteStatus, itemsToDelete]);

  const handleDeleteClick: () => void = useCallback((): void => {
    setOpenDeleteModal(true);
  }, []);

  const handleCloseDeleteExperimentModal: (confirm?: boolean) => void = useCallback((confirm?: boolean): void => {
    if (confirm) {
      const items = experimentsData.filter(experiment => checkedRows[experiment.id]);
      setItemsToDelete(items);
      const ids: number[] = Object.keys(checkedRows).map((key: string) => parseInt(key))
      post({
        data: { ids }
      });
    }
    setOpenDeleteModal(false);
  }, [post, experimentsData, checkedRows]);

  const handleCheckboxClick = useCallback((rowInfo: ExperimentData): void => {
    const rowId = rowInfo.id as number;
    setCheckedRows((prevState: Record<number, boolean>) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  }, []);

  const handleDuplicateClick = useCallback((row: ExperimentData) => {
    // Navigate to the Home Page
    navigate('/qujata', { state: { row } });
  }, [navigate]);

  const headers = useMemo(() => {
    const columnDefs = [
      { 
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.CHECKBOX,
        accessor: () => null,
        cell: (cellInfo: CellContext<ExperimentData, unknown>) => {
          const rowInfo: ExperimentData = cellInfo.row.original;
          return (
            <div className={styles.input_option} key={rowInfo.id}>
              <img
                data-testid={`${rowInfo.id}-checkbox-image`}
                className={styles.input_option_checkbox_icon}
                src={checkedRows[rowInfo.id!] ? CheckedSvg : UnCheckedSvg}
                alt='row-option'
                onClick={() => handleCheckboxClick(rowInfo)}
              />
              <input
                data-testid={`${rowInfo.id}-checkbox`}
                type='checkbox'
                id={rowInfo.id?.toString()}
                className={styles.input_form_item}
                onChange={() => handleCheckboxClick(rowInfo)}
              />
            </div>
          )
        }
      },
      {
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.EXPERIMENT_NAME.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.EXPERIMENT_NAME.NAME,
        accessor: (row: ExperimentData) => row.name
      },
      {
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.ALGORITHMS.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.ALGORITHMS.NAME,
        accessor: (row: ExperimentData) => row.algorithms?.join(', ')
      },
      {
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.ITERATIONS.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.ITERATIONS.NAME, 
        accessor: (row: ExperimentData) => row.iterations?.join(', ')
      },
      {
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.MESSAGE_SIZES.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.MESSAGE_SIZES.NAME, 
        accessor: (row: ExperimentData) => row.message_sizes?.join(', ')
      },
      { 
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.DATE.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.DATE.NAME,
        accessor: (row: ExperimentData) => formatDistanceToNow(row.end_time, { addSuffix: true })
      },
      { 
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.LINKS.DUPLICATE,
        accessor: () => null,
        cell: (cellInfo: CellContext<ExperimentData, unknown>) => (
          <Button
            key={cellInfo.row.original.id}
            ariaLabel={DuplicateAriaLabel}
            size={ButtonSize.NONE}
            styleType={ButtonStyleType.WRAPPER}
            actionType={ButtonActionType.BUTTON}
            onButtonClick={() => handleDuplicateClick(cellInfo.row.original)}
          >
            <img src={DuplicateSvg} alt={DuplicateAriaLabel} />
          </Button>
        )
      },
    ];
  
    return columnDefs.map(({ id, name, accessor, cell }) => ({
      id,
      header: () => <span>{name}</span>,
      accessor,
      cell: cell || ((cellInfo: CellContext<ExperimentData, unknown>) => <span>{cellInfo.getValue() as ReactNode}</span>)
    }));
  }, [checkedRows, handleCheckboxClick, handleDuplicateClick]);

  const checkedExperimentNames = experimentsData
    .filter((experiment: ExperimentData) => checkedRows[experiment.id])
    .map((experiment: ExperimentData) => experiment.name);

  return (
    <div className={styles.experiments_wrapper}>
      <>
        { status === FetchDataStatus.Success &&
          <div className={styles.title_options_container}>
            <label className={styles.experiments_title}>{`${ALL_EXPERIMENTS_TABLE_EN.TITLE} (${experimentsData.length})`}</label>
            {Object.values(checkedRows).some((value: boolean) => value) && (
              <Button
                ariaLabel={DeleteAriaLabel}
                size={ButtonSize.NONE}
                styleType={ButtonStyleType.WRAPPER}
                actionType={ButtonActionType.BUTTON}
                onButtonClick={handleDeleteClick}
              >
                <div className={styles.options_wrapper}>
                  <img className={cn(styles.trash_icon, styles.default_image)} src={TrashSvg} alt={DeleteAriaLabel} />
                  <img className={cn(styles.trash_icon, styles.hover_image)} src={TrashHoverSvg} alt={DeleteAriaLabel} />
                </div>
              </Button>
            )}
          </div>
        }
        {experimentsData.length > 0 && <Table className={styles.experiments_table} headers={headers} data={experimentsData} />}
        {openDeleteModal && <DeleteExperimentModal name={checkedExperimentNames} onClose={handleCloseDeleteExperimentModal} />}
       </>
    </div>
  ); 
}
