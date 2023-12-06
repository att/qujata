import { render, RenderResult } from '@testing-library/react';
import { BarChart, generateTooltipTitle, renderTooltipLabel } from './BarChart';
import Chart from 'chart.js';

jest.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="chart">Chart</div>, // add data-testid attribute
}));
jest.mock('chart.js');

const tooltipKeys = ['messageSizeBytes', 'iterations'];
const tooltipLabels = ['Message Size', 'Iterations'];
const data = [
    {
        "algorithm": "Algorithm1",
        "iterations": 1,
        "messageSizeBytes": 12,
        "results": {
            "averageCPU": 5,
            "averageMemory": 512,
            "errorRate": 0.05,
            "bytesThroughput": 2048000,
            "messagesThroughput": 500,
            "averageTLSHandshakeTime": 10.2
        }
    },
    {
        "algorithm": "Algorithm1",
        "iterations": 133,
        "messageSizeBytes": 1233,
        "results": {
            "averageCPU": 533,
            "averageMemory": 512,
            "errorRate": 0.05,
            "bytesThroughput": 2048000,
            "messagesThroughput": 500,
            "averageTLSHandshakeTime": 10.2
        }
    },
    {
        "algorithm": "Algorithm1",
        "iterations": 1000,
        "messageSizeBytes": 102,
        "results": {
            "averageCPU": 25,
            "averageMemory": 512,
            "errorRate": 0.05,
            "bytesThroughput": 2048000,
            "messagesThroughput": 500,
            "averageTLSHandshakeTime": 10.2
        }
    },
    {
        "algorithm": "Algorithm2",
        "iterations": 2000,
        "messageSizeBytes": 124,
        "results": {
            "averageCPU": 28,
            "averageMemory": 512,
            "errorRate": 0.05,
            "bytesThroughput": 2048000,
            "messagesThroughput": 500,
            "averageTLSHandshakeTime": 10.2
        }
    },
    {
        "algorithm": "Algorithm3",
        "iterations": 2000,
        "messageSizeBytes": 124,
        "results": {
            "averageCPU": 28,
            "averageMemory": 512,
            "errorRate": 0.05,
            "bytesThroughput": 2048000,
            "messagesThroughput": 500,
            "averageTLSHandshakeTime": 10.2
        }
    }
];
describe('BarChart', () => {
  test('renders BarChart component', () => {
    const { getByTestId }: RenderResult = render(<BarChart labels={['Algorithm1', 'Algorithm1']} data={data} title={'chart'} keyOfData={'averageCPU'} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} />);
    const chartElement: HTMLElement = getByTestId('chart');
    expect(chartElement).toBeTruthy();
  });
  
  test('should return correct label', () => {
    const tooltipItem = { datasetIndex: 0, index: 0 };
    const result = renderTooltipLabel(tooltipItem, [5, 533, 25, 28, 28], tooltipKeys, tooltipLabels, data);
    expect(result).toBe('5 (Message Size: 12, Iterations: 1)');
  });

  test('should return correct title', () => {
    const result = generateTooltipTitle(['label1', 'label2'], 0);
    expect(result).toBe('label1');
  });
});
