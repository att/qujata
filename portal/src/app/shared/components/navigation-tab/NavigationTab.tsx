import { NavLink, useLocation } from 'react-router-dom';
import styles from './NavigationTab.module.scss';
import cn from 'classnames';

export interface INavigationTab {
  title: string;
  link: string;
}
export interface NavigationTabProps {
  tabs: INavigationTab[];
}

export const NavigationTab: React.FC<NavigationTabProps> = (props: NavigationTabProps) => {
    const { tabs } = props;
    const location = useLocation();

    return (
        <div className={styles.tabs}>
           {tabs.map(((tab: INavigationTab, index: number) => (
            <div key={index}>
                <NavLink 
                    className={cn(styles.tab, {[styles.activeTab]: location.pathname === tab.link})} 
                    to={tab.link}             
                >
                    {tab.title}
                </NavLink>
            </div>
          )))}
        </div>
    );
}
