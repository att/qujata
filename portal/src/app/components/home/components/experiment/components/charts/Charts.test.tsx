import { render } from '@testing-library/react';
import { Charts } from './Charts';
import { useChartsData } from './hooks/useChartsData';
import { BarChart } from '../../../../../dashboard/components/charts/BarChart';
import { LineChart } from '../../../../../dashboard/components/charts/LineChart';

jest.mock('./hooks/useChartsData');
jest.mock('../../../../../dashboard/components/charts/BarChart');
jest.mock('../../../../../dashboard/components/charts/LineChart');
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

      const { container } = render(<Charts />);
      expect(container).toBeTruthy();
    });
});
