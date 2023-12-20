import styles from './ToggleButton.module.scss';
import cn from 'classnames';

export type ToggleButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isSelected: boolean;
  children: React.ReactNode;
};

export const ToggleButton: React.FC<ToggleButtonProps> = (props: ToggleButtonProps) => {
  return (
    <div className={styles.toggle_button_wrapper}>
      <button
        className={`${styles.toggle_button} ${props.isSelected ? styles.selected : ''}`}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  );
};
