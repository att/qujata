import { fireEvent, render, RenderResult } from '@testing-library/react';
import { BarChart, generateTooltipTitle, renderTooltipLabel } from './BarChart';
import { ChartData, ChartOptions, InteractionItem } from 'chart.js';
import React from 'react';
import { MOCK_DATA_FOR_CHART_UTILS } from '../../../../home/components/experiment/components/charts/utils/__mocks__';

let options: ChartOptions<any>;

jest.mock('react-chartjs-2', () => ({
    Bar: (props: { options: ChartOptions<any> }) => {
      options = props.options;
      return <div>Chart</div>;
    },
}));
jest.mock('chart.js');

describe('BarChart', () => {
  let chartRef: any;
  let tooltipKeys: string[];
  let tooltipLabels: string[];
  let titleMock: string;
  
  beforeAll(() => {
    tooltipKeys = ['algorithm', 'iterations'];
    tooltipLabels = ['Algorithm', 'Iterations'];
    titleMock = 'chart';
  });

  test('should render BarChart correctly', () => {
    const { container, getByTestId }: RenderResult = render(<BarChart labels={['Algorithm1', 'Algorithm1']} data={MOCK_DATA_FOR_CHART_UTILS} title={titleMock} keyOfData={'average_cpu'} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} />);

    const barChartWrapperElement: HTMLElement = getByTestId('bar_chart_wrapper');
    fireEvent.mouseMove(barChartWrapperElement);
    fireEvent.mouseOut(barChartWrapperElement);

    expect(container).toBeTruthy();
    expect(barChartWrapperElement.style.cursor).toBe('default');
  });

  test('should change cursor to pointer when mouse is over a chart element', () => {
    chartRef = {
      current: {
        getElementsAtEventForMode: jest.fn().mockReturnValue([{
          index: 0,
          datasetIndex: 0,
          element: { x: 1, y: 1, active: true, options: {} }
        }] as InteractionItem[] ),
      },
    };
    jest.spyOn(React, 'useRef').mockReturnValue(chartRef);
  
    const { container, getByTestId }: RenderResult = render(<BarChart labels={['Algorithm1', 'Algorithm1']} data={MOCK_DATA_FOR_CHART_UTILS} title={undefined} keyOfData={'average_cpu'} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} />);
    
    const lineChartWrapperElement: HTMLElement = getByTestId('bar_chart_wrapper');
    fireEvent.mouseMove(lineChartWrapperElement);
  
    expect(container).toBeTruthy();
    expect(lineChartWrapperElement.style.cursor).toBe('pointer');
  });
  
  test('should return correct label', () => {
    const tooltipItem = { datasetIndex: 0, index: 0 };
    const result = renderTooltipLabel(tooltipItem, [5, 533, 25, 28, 28], tooltipKeys, tooltipLabels, MOCK_DATA_FOR_CHART_UTILS);
    expect(result).toBe('5 (Algorithm: Algorithm1, Iterations: 1000)');
  });

  test('should return correct title', () => {
    const result = generateTooltipTitle(['label1', 'label2'], 0);
    expect(result).toBe('label1');
  });

  test('should pass correct options to Bar component', () => {
    render(<BarChart labels={['Algorithm1', 'Algorithm1']} data={MOCK_DATA_FOR_CHART_UTILS} title={undefined} keyOfData={'average_cpu'} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} />);

    expect(options).toBeDefined();
    
    // Test the different scenarios for fully coverage the legend of the BarChart
    let mockItem = { datasetIndex: 0, text: 'label1 (iteration1)' };
    const mockChart = { datasets: [{ label: 'label1 (iteration1)' }, { label: 'label2 (iteration2)' }] };
    let filterResult = options.plugins.legend.labels.filter(mockItem, mockChart);
    expect(filterResult).toBe(true);

    mockItem = { datasetIndex: 1, text: 'label1 (iteration1)' };
    filterResult = options.plugins.legend.labels.filter(mockItem, mockChart);
    expect(filterResult).toBe(false);

    let mockChartForGenerateLabels: ChartData<'bar'> = { 
        datasets: [
          { 
            label: 'label1 (iteration1)', 
            data: []
          }
        ] 
    };
    let generateLabelsResult = options.plugins.legend.labels.generateLabels(mockChartForGenerateLabels);
    expect(generateLabelsResult).toEqual([]);
  });

  test('should pass correct options for tooltip callbacks to Bar component', () => {
    render(<BarChart labels={['Algorithm1', 'Algorithm2']} data={MOCK_DATA_FOR_CHART_UTILS} title={titleMock} keyOfData={'average_cpu'} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} />);

    expect(options).toBeDefined();
    
    // Test the different scenarios for fully coverage the tooltip of the BarChart
    let contextForTitleCallback = [{ datasetIndex: 1 }];
    let titleResult = options.plugins.tooltip.callbacks.title(contextForTitleCallback);
    expect(titleResult).toBe('Algorithm2');

    let contextForLabelCallback = { datasetIndex: 0 };
    let labelResult = options.plugins.tooltip.callbacks.label(contextForLabelCallback);
    expect(labelResult).toBe('25.5 (Algorithm: Algorithm1, Iterations: 1000)');
  });
});
