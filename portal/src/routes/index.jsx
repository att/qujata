import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import { Home } from '../app/components/home/Home';

const isAllExperimentTabEnabled = false;
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
          {
            path: '/',
            element: <Home />,
            children: [
                {
                    path: 'ExperimentName',
                    element: <div>Experiment Name</div>,
                },
            ],
          },
          ...(isAllExperimentTabEnabled ? [{
            path: 'All-Experiments',
            element: <div>All Experiments</div>,
          }] : []),
        ],
    },
]);
