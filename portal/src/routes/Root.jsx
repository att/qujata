import styles from './Root.module.scss';
import { GlobalHeader } from '../app/shared/components/global-header/index';
import { Outlet } from 'react-router-dom';
import { tabs } from '../app/shared/constants/navigation-tabs.const';
import { Spinner, SpinnerSize } from '../app/shared/components/att-spinner';
import { useSpinnerContext } from '../app/shared/context/spinner';
import { GHPages } from "../gh-pages";

export default function Root() {
  const { isSpinnerOn } = useSpinnerContext();
  const env = process.env.REACT_APP__ENVIRONMENT;
  return (
    
    <>
      <GlobalHeader tabs={ env === 'gh-pages' ? [] : tabs} />
      {isSpinnerOn && renderSpinner()}
      { 
        env === 'gh-pages' ?  (<GHPages />) :(<Outlet />)
      }
              
      
    </>
  );
}

function renderSpinner() {
  return (
      <div className={styles.spinner_overlay}>
          <div className={styles.spinner_wrapper}>
          <Spinner size={SpinnerSize.MEDIUM} />
          </div>
      </div>
  );
}
