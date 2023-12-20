import { render, waitFor } from '@testing-library/react';
import { SubHeader } from './components/sub-header';
import { Charts } from './components/charts';
import { Experiment } from './Experiment';
import { ExperimentTable } from './components/experiment-table';
import { useExperimentData } from './components/hooks/useExperimentData';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';

jest.mock('./components/hooks/useExperimentData');
jest.mock('./components/sub-header');
jest.mock('./components/experiment-table');
jest.mock('./components/charts', () => ({
  Charts: jest.fn(),
}));

const mockData = {
    "id": 1,
    "name": "test1",
    "description": "simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    "start_time": "Thu, 14 Dec 2023 15:37:31 GMT",
    "end_time": "Thu, 14 Dec 2023 15:38:39 GMT",
    "environment_info": {
      "codeRelease": "1.1.0",
      "cpu": "RELACE_WITH_CPU",
      "cpuArchitecture": "RELACE_WITH_CPU_ARCHITECTURE",
      "cpuClockSpeed": "RELACE_WITH_CLOCK_SPEED",
      "cpuCores": 0,
      "nodeSize": "RELACE_WITH_NODE_SIZE",
      "operatingSystem": "RELACE_WITH_OPERATING_SYSTEM",
      "resourceName": "RELACE_WITH_RESOURCE_NAME"
    },
   
    "testRuns": [
      {
        "id":1,
        "algorithm": "bikel1",
        "iterations": 1000,
        "results": {
          "averageCPU": 3.5,
          "averageMemory": 3
        }
      },
      {
        "id":2,
        "algorithm": "bikel1",
        "iterations": 2000,
        "results": {
          "averageCPU": 7.0,
          "averageMemory": 6
        }
      },
      {
       "id":3,
        "algorithm": "kyber512",
        "iterations": 1000,
        "results": {
          "averageCPU": 1.7,
          "averageMemory": 2
        }
      },
      {
        "id":4,
        "algorithm": "kyber512",
        "iterations": 2000,
        "results": {
          "averageCPU": 2.6,
          "averageMemory": 2
        }
      }
    ]
  };
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
