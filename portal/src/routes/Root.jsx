import { GlobalHeader } from '../app/shared/components/global-header/index';
import { SHARED_EN } from '../../src/app/shared/translate/en';
import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <GlobalHeader title={SHARED_EN.WEB_PORTAL_NAME} />
      <Outlet />
    </>
  );
}
