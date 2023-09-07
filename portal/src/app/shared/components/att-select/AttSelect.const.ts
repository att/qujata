import styles from './AttSelect.module.scss';
import { AttSelectTheme } from './AttSelect.model';

export const AttSelectCssClassByTheme: Map<AttSelectTheme, string> = new Map<AttSelectTheme, string>([
  [AttSelectTheme.PRIMARY, styles.att_select_primary_theme],
  [AttSelectTheme.WRAPPER, styles.att_select_wrapper_theme],
  [AttSelectTheme.REGULAR, ''],
]);
