import { RouterProvider } from 'react-router-dom';
import { RootContextState } from './shared/context/RootContextState';
import { ToastContainer } from 'react-toastify';
import { ToastContainerConfig } from './shared/components/toast/toast-container-config.const';
import { router } from '../routes';

const App: React.FC = () => (
    <RootContextState>
      <ToastContainer {...ToastContainerConfig} />
      <RouterProvider router={router} />
    </RootContextState>
);

export default App;
