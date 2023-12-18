import { render } from '@testing-library/react';
import { Charts } from './Charts';
import { useChartsData } from './hooks/useChartsData';
import { BarChart } from '../../../../../dashboard/components/charts/BarChart';
import { LineChart } from '../../../../../dashboard/components/charts/LineChart';
import { IExperimentData } from '../../Experiment';

jest.mock('./hooks/useChartsData');
jest.mock('../../../../../dashboard/components/charts/BarChart');
jest.mock('../../../../../dashboard/components/charts/LineChart');

const mockData: IExperimentData = {
    data: {
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

const mockBarChartData = [{
    algorithm: "Algorithm1",
    iterations: 100,
    messageSizeBytes: 104,
    results: {
        averageCPU: 2,
        averageMemory: 52,
        averageTLSHandshakeTime: 10,
        bytesThroughput: 100,
        errorRate: 1,
        messagesThroughput: 3,
    },
}];

const barChartLabelsMock = ['Algorithm1'];
const barChartKeysOfDataMock = ["averageCPU", "averageMemory", "errorRate", "bytesThroughput", "messagesThroughput", "averageTLSHandshakeTime"];
const lineChartDataMock = {
    datasets: [{
        backgroundColor: "#05BBFF",
        borderColor: "#05BBFF",
        borderWidth: 1,
        fill: false,
        label: "Algorithm1",
        data: {
            averageCPU: [2],
            averageMemory: [3],
            averageTLSHandshakeTime: [3],
            bytesThroughput: [3],
            errorRate: [1],
            messagesThroughput: [2],
        }
    }],
    labels: [24, 104, 122, 124, 1024],
};
describe('Charts', () => {
    test('should render SubHeader', async () => {
        (BarChart as jest.Mock).mockImplementation(() => <div>BarChart</div>);
        (LineChart as jest.Mock).mockImplementation(() => <div>LineChart</div>);

      (useChartsData as jest.Mock).mockReturnValue({ barChartData: mockBarChartData, barChartLabels: barChartLabelsMock, barChartKeysOfData: barChartKeysOfDataMock, lineChartData: lineChartDataMock });

      const { container } = render(<Charts { ...mockData } />);
      expect(container).toBeTruthy();
    });
});
