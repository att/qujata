import { render, waitFor } from '@testing-library/react';
import { SubHeader } from './components/sub-header';
import { Charts } from './components/charts';
import { Experiment } from './Experiment';
import { ExperimentTable } from './components/experiment-table';
import { useExperimentData } from './components/hooks/useExperimentData';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';
import { MOCK_DATA_FOR_EXPERIMENT } from './components/__mocks__';
import { Toggles } from './components/toggles';

jest.mock('./components/hooks/useExperimentData');
jest.mock('./components/sub-header');
jest.mock('./components/toggles');
jest.mock('./components/experiment-table');
jest.mock('./components/charts', () => ({
  Charts: jest.fn(),
}));

describe('Experiment', () => {
    test('should render Experiment', async () => {
      (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
      (Toggles as jest.Mock).mockImplementation(() => <div>Toggles</div>);
      (ExperimentTable as jest.Mock).mockImplementation(() => <div>ExperimentTable</div>);
      (Charts as jest.Mock).mockImplementation(() => <div>Charts</div>);
      (useExperimentData as jest.Mock).mockReturnValue({
        data: MOCK_DATA_FOR_EXPERIMENT,
        status: FetchDataStatus.Success,
      });
      const { container } = render(<Experiment />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });

    test('should show spinner on render data', async () => {
      (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
      (Toggles as jest.Mock).mockImplementation(() => <div>Toggles</div>);
      (ExperimentTable as jest.Mock).mockImplementation(() => <div>ExperimentTable</div>);
      (Charts as jest.Mock).mockImplementation(() => <div>Charts</div>);
      (useExperimentData as jest.Mock).mockReturnValue({
        data: MOCK_DATA_FOR_EXPERIMENT,
        status: FetchDataStatus.Fetching,
      });
      const { container } = render(<Experiment />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });
});
