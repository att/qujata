import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import { Home } from '../app/components/home/Home';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'ExperimentName',
            element: <div>Experiment Name</div>,
          },
          {
            path: 'All-Experiments',
            element: <div>All Experiments</div>,
          },
        ],
    },
]);
