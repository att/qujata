import { GlobalHeader } from '../app/shared/components/global-header/index';
import { Outlet } from 'react-router-dom';
import { tabs } from '../app/shared/constants/navigation-tabs.const';

export default function Root() {
  return (
    <>
      <GlobalHeader tabs={tabs} />
      <Outlet />
    </>
  );
}
