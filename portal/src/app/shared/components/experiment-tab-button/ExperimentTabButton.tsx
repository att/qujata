import styles from './ExperimentTabButton.module.scss';
import cn from 'classnames';

export type ExperimentTabButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isSelected: boolean;
  children: React.ReactNode;
};

export const ExperimentTabButton: React.FC<ExperimentTabButtonProps> = (props: ExperimentTabButtonProps) => {
  return (
    <div className={styles.experiment_tab_button_wrapper}>
      <button
        className={cn(styles.experiment_tab_button, {[styles.selected]: props.isSelected})}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  );
};
