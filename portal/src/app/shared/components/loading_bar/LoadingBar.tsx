import cn from 'classnames';
import styles from './LoadingBar.module.scss';

export interface LoadingBarProps {
  className?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = (props: LoadingBarProps) => (
  <div className={cn(props.className, styles.loading_bar_container)}>
    <div className={styles.loading_bar} />
  </div>
);
