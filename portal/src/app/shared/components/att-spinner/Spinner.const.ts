import styles from './Spinner.module.scss';
import { SpinnerSize } from './Spinner.model';

export const SpinnerCssClassBySize: Map<SpinnerSize, string> = new Map<SpinnerSize, string>([
  [SpinnerSize.EXTRA_SMALL, styles.xs_spinner],
  [SpinnerSize.SMALL, styles.sm_spinner],
  [SpinnerSize.MEDIUM, styles.md_spinner],
  [SpinnerSize.LARGE, styles.lg_spinner],
  [SpinnerSize.NONE, ''],
]);
