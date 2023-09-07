import styles from './Button.module.scss';
import { ButtonSize, ButtonStyleType } from './Button.model';

export const ButtonCssClassByStyleType: Map<ButtonStyleType, string> = new Map<ButtonStyleType, string>([
  [ButtonStyleType.PRIMARY, styles.primary_button],
  [ButtonStyleType.SECONDARY, styles.secondary_button],
  [ButtonStyleType.TEXT, styles.txt_button],
  [ButtonStyleType.WRAPPER, styles.wrapper_button],
]);

export const ButtonCssClassBySize: Map<ButtonSize, string> = new Map<ButtonSize, string>([
  [ButtonSize.SMALL, styles.sm_button],
  [ButtonSize.MEDIUM, styles.md_button],
  [ButtonSize.LARGE, styles.lg_button],
  [ButtonSize.NONE, ''],
]);
