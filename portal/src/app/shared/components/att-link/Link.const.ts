import styles from './Link.module.scss';
import { LinkSize, LinkStyle } from './Link.model';

export const LinkCssClassByStyleType: Map<LinkStyle, string> = new Map<LinkStyle, string>([
  [LinkStyle.PRIMARY, styles.primary_link],
  [LinkStyle.SECONDARY, styles.secondary_link],
  [LinkStyle.WRAPPER, styles.wrapper_link],
  [LinkStyle.TEXT, styles.text_link],
  [LinkStyle.NONE, ''],
]);

export const LinkCssClassBySize: Map<LinkSize, string> = new Map<LinkSize, string>([
  [LinkSize.SMALL, styles.sm_link],
  [LinkSize.MEDIUM, styles.md_link],
  [LinkSize.LARGE, styles.lg_link],
  [LinkSize.NONE, ''],
]);
