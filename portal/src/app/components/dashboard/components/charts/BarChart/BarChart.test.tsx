import { render, RenderResult } from '@testing-library/react';
import { BarChart, generateTooltipTitle, renderTooltipLabel } from './BarChart';

jest.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="chart">Chart</div>,
}));
jest.mock('chart.js');

const tooltipKeys = ['algorithm', 'iterations'];
const tooltipLabels = ['Algorithm', 'Iterations'];
const data = [
    {
        "algorithm": "Algorithm1",
        "iterations": 1,
        "results": {
            "averageCPU": 5,
            "averageMemory": 512,
        }
    },
    {
        "algorithm": "Algorithm1",
        "iterations": 133,
        "results": {
            "averageCPU": 533,
            "averageMemory": 512,
        }
    },
    {
        "algorithm": "Algorithm1",
        "iterations": 1000,
        "results": {
            "averageCPU": 25,
            "averageMemory": 512,
        }
    },
    {
        "algorithm": "Algorithm2",
        "iterations": 2000,
        "results": {
            "averageCPU": 28,
            "averageMemory": 512,
        }
    },
    {
        "algorithm": "Algorithm3",
        "iterations": 2000,
        "results": {
            "averageCPU": 28,
            "averageMemory": 512,
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
    expect(result).toBe('5 (Algorithm: Algorithm1, Iterations: 1)');
  });

  test('should return correct title', () => {
    const result = generateTooltipTitle(['label1', 'label2'], 0);
    expect(result).toBe('label1');
  });
});
