import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import { Home } from '../app/components/home/Home';
import { Experiment } from '../app/components/home/components/experiment/Experiment';

const isAllExperimentTabEnabled = false;
export const router = createBrowserRouter([
    {
        path: '/qujata',
        element: <Root />,
        children: [
          {
            path: '',
            index: true,
            element: <Home />,
          },
          {
            path: 'experiment/:testSuiteId',
            element: <Experiment />,
          },
          ...(isAllExperimentTabEnabled ? [{
            path: 'All-Experiments',
            element: <div>All Experiments</div>,
          }] : []),
        ],
    },
]);
