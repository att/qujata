import { render } from '@testing-library/react';
import { ExperimentTable } from './ExperimentTable';
import { IExperimentData } from '../../Experiment';

jest.mock('../hooks/useExperimentData');
const mockData: IExperimentData = {
  "data": {
    "id": 1,
    "name": "TestRun1",
    "description": "TestRun1",
    "start_time": "2021-07-26T12:00:00.000Z",
    "end_time": "2021-07-26T12:00:00.000Z",
    "environment_info": { 
      "resourceName": "gddn-aks", 
      "operatingSystem": "Linux", 
      "cpu": "3rd Generation Platinum 8370C",
      "cpuArchitecture": "Ice Lake", 
      "cpuCores": 4, 
      "cpuClockSpeed": "4 MHz", 
      "nodeSize": "Standard_D4s_v5", 
      "codeRelease": "1.1.0",
    }, 
    "testRuns": [ 
      {
        "id": 1,
        "algorithm": "Algorithm1", 
        "iterations": 1024, 
        "results":  
        { 
          "averageCPU": 25.5, 
          "averageMemory": 512, 
        } 
      }, 
      { 
        "id": 2,
        "algorithm": "Algorithm2", 
        "iterations": 1024,
        "results":  
        { 
          "averageCPU": 25.5, 
          "averageMemory": 512, 
        } 
      }, 
      { 
        "id": 3,
        "algorithm": "Algorithm1", 
        "iterations": 104,
        "results":  
        { 
          "averageCPU": 2, 
          "averageMemory": 52,
        } 
      }
    ]
  }
};

const mockDataNoTestRunsProps: IExperimentData = {
  "data": {
    "id": 1,
    "name": "TestRun1",
    "description": "TestRun1",
    "start_time": "2021-07-26T12:00:00.000Z",
    "end_time": "2021-07-26T12:00:00.000Z",
    "environment_info": { 
      "resourceName": "gddn-aks", 
      "operatingSystem": "Linux", 
      "cpu": "3rd Generation Platinum 8370C",
      "cpuArchitecture": "Ice Lake", 
      "cpuCores": 4, 
      "cpuClockSpeed": "4 MHz", 
      "nodeSize": "Standard_D4s_v5", 
      "codeRelease": "1.1.0",
    }, 
    "testRuns": []
  }
};

describe('ExperimentTable', () => {
    test('should render ExperimentTable', async () => {

      // (useExperimentData as jest.Mock).mockReturnValue({ data: mockData });

      const { container } = render(<ExperimentTable {...mockData} />);
      expect(container).toBeTruthy();
    });

    test('should render ExperimentTable with no data', async () => {

      // (useExperimentData as jest.Mock).mockReturnValue({ data: mockDataNoTestRunsProps });

      const { container } = render(<ExperimentTable {...mockDataNoTestRunsProps} />);
      expect(container).toBeTruthy();
    });
});
