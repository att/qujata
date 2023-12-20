import { render, waitFor } from '@testing-library/react';
import { SubHeader } from './components/sub-header';
import { Charts } from './components/charts';
import { Experiment } from './Experiment';
import { ExperimentTable } from './components/experiment-table';
import { useExperimentData } from './components/hooks/useExperimentData';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';
import { MOCK_DATA_FOR_EXPERIMENT } from './components/__mocks__';

jest.mock('./components/hooks/useExperimentData');
jest.mock('./components/sub-header');
jest.mock('./components/experiment-table');
jest.mock('./components/charts', () => ({
  Charts: jest.fn(),
}));

const mockData = MOCK_DATA_FOR_EXPERIMENT;
describe('Experiment', () => {
    test('should render Experiment', async () => {
      (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
      (ExperimentTable as jest.Mock).mockImplementation(() => <div>ExperimentTable</div>);
      (Charts as jest.Mock).mockImplementation(() => <div>Charts</div>);
      (useExperimentData as jest.Mock).mockReturnValue({
        data: mockData,
        status: FetchDataStatus.Success,
      });
      const { container } = render(<Experiment />);

      await waitFor(() => {
        expect(container).toBeTruthy();
      });
    });

    test('should show spinner on render data', async () => {
        (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
        (ExperimentTable as jest.Mock).mockImplementation(() => <div>ExperimentTable</div>);
        (Charts as jest.Mock).mockImplementation(() => <div>Charts</div>);
        (useExperimentData as jest.Mock).mockReturnValue({
          data: mockData,
          status: FetchDataStatus.Fetching,
        });
        const { container } = render(<Experiment />);
  
        await waitFor(() => {
          expect(container).toBeTruthy();
        });
    });
});
