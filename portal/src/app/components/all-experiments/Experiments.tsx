import { ReactNode, useCallback, useMemo } from 'react';
import styles from './Experiments.module.scss';
import { Experiment, IUseExperimentsData, useExperimentsData } from './hooks';
import { FetchDataStatus } from '../../shared/hooks/useFetch';
import { Spinner, SpinnerSize } from '../../shared/components/att-spinner';
import { ALL_EXPERIMENTS_TABLE_EN } from './translate/en';
import { CellContext } from '@tanstack/react-table';
import { Table } from '../../shared/components/table';
import DuplicateSvg from '../../../assets/images/duplicate.svg';
import { Button, ButtonActionType, ButtonSize, ButtonStyleType } from '../../shared/components/att-button';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';

const DuplicateAriaLabel: string = ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.LINKS.DUPLICATE;

export const Experiments: React.FC = () => {
  const { experiments, status }: IUseExperimentsData = useExperimentsData();
  const experimentsData = useMemo(() => (experiments ?? []), [experiments]);
  const navigate = useNavigate();

  const handleButtonClick = useCallback((row: Experiment) => {
    console.log('Button clicked on row:', row);
    // need to naviage with the entire row data, so we can duplicate it properly
    navigate('/qujata');
  }, [navigate]);

  const headers = useMemo(() => {
    const columnDefs = [
      {
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.EXPERIMENT_NAME.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.EXPERIMENT_NAME.NAME,
        accessor: (row: Experiment) => row.experimentName
      },
      {
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.ALGORITHMS.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.ALGORITHMS.NAME,
        accessor: (row: Experiment) => row.algorithms.join(', ')
      },
      {
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.ITERATIONS.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.ITERATIONS.NAME, 
        accessor: (row: Experiment) => row.iterations.join(', ')
      },
      { 
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.MESSAGE_SIZE.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.MESSAGE_SIZE.NAME,
        accessor: (row: Experiment) => row.messageSizes.join(', ')
      },
      { 
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.DATE.ID,
        name: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.DATE.NAME,
        accessor: (row: Experiment) => row.date
      },
      { 
        id: ALL_EXPERIMENTS_TABLE_EN.TABLE_COLUMNS.LINKS.DUPLICATE,
        accessor: () => null,
        cell: (cellInfo: CellContext<Experiment, unknown>) => (
          <Button
            ariaLabel={DuplicateAriaLabel}
            size={ButtonSize.NONE}
            styleType={ButtonStyleType.WRAPPER}
            actionType={ButtonActionType.BUTTON}
            onButtonClick={() => handleButtonClick(cellInfo.row.original)}
          >
            <img className={styles.duplicate_icon} src={DuplicateSvg} alt={DuplicateAriaLabel} />
          </Button>
        )
      },
    ];
  
    return columnDefs.map(({ id, name, accessor, cell }) => ({
      id,
      header: () => <span>{name}</span>,
      accessor,
      cell: cell || ((cellInfo: CellContext<Experiment, unknown>) => <span>{cellInfo.getValue() as ReactNode}</span>)
    }));
  }, [handleButtonClick]);

  return (
    <div className={styles.experiments_wrapper}>
      {status === FetchDataStatus.Fetching ? renderSpinner() : (
        <div>
          <label className={styles.experiments_title}>{`${ALL_EXPERIMENTS_TABLE_EN.TITLE} (${experiments.length})`}</label>
          <Table className={styles.experiments_table} headers={headers} data={experimentsData} />
        </div>
      )}
    </div>
  ); 
}

function renderSpinner() {
  return (
    <div className={styles.spinner_overlay}>
      <div className={styles.spinner_wrapper}>
      <Spinner size={SpinnerSize.MEDIUM} />
      </div>
    </div>
  );
}
