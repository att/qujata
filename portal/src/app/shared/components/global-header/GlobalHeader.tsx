import { PropsWithChildren } from 'react';
import cn from 'classnames';
import { NAVIGATION_ROUTES } from '../../../routes-navigation.const';
import { InternalLink, LinkStyle, LinkSize } from '../att-link';
import styles from './GlobalHeader.module.scss';
import QujataLogoSvg from '../../../../assets/images/qujata-logo.svg';
import { INavigationTab, NavigationTab } from '../navigation-tab/NavigationTab';

export interface GlobalHeaderProps {
  tabs: INavigationTab[];
  className?: string
}
export const GlobalHeader: React.FC<PropsWithChildren<GlobalHeaderProps>> = (props: PropsWithChildren<GlobalHeaderProps>) => (
  <header className={cn(props.className, styles.global_header)}>
    <div className={styles.header_left_block}>
      <InternalLink
        className={styles.logo}
        link={NAVIGATION_ROUTES.home}
        styleType={LinkStyle.WRAPPER}
        size={LinkSize.NONE}
      >
        <img className={styles.home_icon} src={QujataLogoSvg} alt="globe" />
      </InternalLink>
    </div>
    <NavigationTab tabs={props.tabs} />
  </header>
);
