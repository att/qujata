import cn from 'classnames';
import { SpinnerSize } from './Spinner.model';
import styles from './Spinner.module.scss';
import { SpinnerCssClassBySize } from './Spinner.const';

/**
 * https://digitaldesign.att.com/individual-bits-and-pieces/page-section-loader.html
 * * */

export interface SpinnerProps {
    className?: string;
    size: SpinnerSize;
}

export const Spinner: React.FC<SpinnerProps> = (props: SpinnerProps) => (
  <svg
    viewBox='0 0 43 43'
    className={cn(props.className, SpinnerCssClassBySize.get(props.size))}
  >
    <g className={styles.spinner}>
      <circle className={styles.spinner_inner} r='20' cx='21.5' cy='21.5' fill='none' />
      <circle className={styles.spinner_outer} r='20' cx='21.5' cy='21.5' fill='none' />
    </g>
  </svg>
);
