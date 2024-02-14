import styles from './Root.module.scss';
import { GlobalHeader } from '../app/shared/components/global-header/index';
import { Outlet } from 'react-router-dom';
import { tabs } from '../app/shared/constants/navigation-tabs.const';
import { Spinner, SpinnerSize } from '../app/shared/components/att-spinner';
import { useSpinnerContext } from '../app/shared/context/spinner';

export default function Root() {
  const { isSpinnerOn } = useSpinnerContext();
  return (
    <>
      <GlobalHeader tabs={tabs} />
      {isSpinnerOn && renderSpinner()}
      <Outlet />
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
