import { render, waitFor } from '@testing-library/react';
import { SubHeader } from './components/sub-header';
import { Charts } from './components/charts';
import { Experiment } from './Experiment';

jest.mock('./components/sub-header');
jest.mock('./components/charts');

describe('Experiment', () => {
    test('should render Experiment', async () => {
      (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
      (Charts as jest.Mock).mockImplementation(() => <div>Charts</div>);

      const { container } = render(<Experiment />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });
});
