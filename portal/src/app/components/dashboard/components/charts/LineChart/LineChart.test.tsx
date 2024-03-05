import { RenderResult, fireEvent, render } from '@testing-library/react';
import { LineChart, generateTooltipTitle, renderTooltipLabel } from './LineChart';
import { ChartOptions, InteractionItem, PointElement, TooltipItem } from 'chart.js';
import React from 'react';

let options: ChartOptions<any>;

jest.mock('chart.js');
jest.mock('react-chartjs-2', () => ({
    Bar: () => <div>Chart</div>,
    Line: (props: { options: ChartOptions<any> }) => {
      options = props.options;
      return <div>Line</div>;
    },
}));

describe('LineChart', () => {
  let mockData: any;
  let chartRef: any;

  beforeAll(() => {
    mockData = {
      datasets: [
        {
          backgroundColor: "#05BBFF",
          borderColor: "#05BBFF",
          borderWidth: 1,
          data: [1, 2, 3, 4],
          fill: false,
          label: "Algorithm1",
        }
      ],
      labels: [12, 14, 23, 104, 200, 300, 1024],
    }
  });

  test('should render LineChart correctly', () => {
    const { container, getByTestId }: RenderResult = render(<LineChart data={mockData} title='title' tooltipLabel='average_cpu' />);
    
    const lineChartWrapperElement: HTMLElement = getByTestId('line_chart_wrapper');
    fireEvent.mouseMove(lineChartWrapperElement);
    fireEvent.mouseOut(lineChartWrapperElement);

    expect(container).toBeTruthy();
    expect(lineChartWrapperElement.style.cursor).toBe('default');
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
  
    const { container, getByTestId }: RenderResult = render(<LineChart data={mockData} title={undefined} tooltipLabel='average_cpu' />);
    
    const lineChartWrapperElement: HTMLElement = getByTestId('line_chart_wrapper');
    fireEvent.mouseMove(lineChartWrapperElement);
  
    expect(container).toBeTruthy();
    expect(lineChartWrapperElement.style.cursor).toBe('pointer');
  });

  test('should render tooltip title', () => {
    const tooltipItem: TooltipItem<'line'> = {
      raw: 12,
      chart: <></> as any,
      label: '',
      parsed: { x: 3, y: 299 },
      formattedValue: '',
      dataset: {
        backgroundColor: "#05BBFF",
        borderColor: "#05BBFF",
        borderWidth: 1,
        data: [1, 2, 3, 4],
        fill: false,
        label: "Algorithm1",
      },
      datasetIndex: 0,
      dataIndex: 0,
      element: <></> as any
    };

    const result = generateTooltipTitle(tooltipItem);

    expect(result).toEqual("Algorithm1");
  });

  test('should render tooltip label', () => {
    const tooltipItem: TooltipItem<'line'> = {
      raw: 12,
      chart: <></> as unknown as any,
      label: '',
      parsed: {x: 3, y: 299},
      formattedValue: '',
      dataset: {
        backgroundColor: "#05BBFF",
        borderColor: "#05BBFF",
        borderWidth: 1,
        data: [1,2,3,4],
        fill: false,
        label: "Algorithm1",
      },
      datasetIndex: 0,
      dataIndex: 0,
      element: <></> as unknown as PointElement
    };

    const result = renderTooltipLabel(tooltipItem, 'chart');

    expect(result).toEqual("chart 12");
  });

  test('generateTooltipTitle', () => {
    const context: any = {
      chart: jest.fn(),
      dataIndex: 3,
      dataset: {
        label: "label-test",
      },
      datasetIndex: 0,
      element: jest.fn(),
      formattedValue: "230",
      label: "label-test",
      parsed: {x: 3, y: 230},
      raw: 230,
    };

    const result = generateTooltipTitle(context);

    expect(result).toEqual("label-test");
  });

  test('should pass correct options for tooltip callbacks to Line component', () => {
    render(<LineChart data={mockData} title={'title'} tooltipLabel='average_cpu' />);

    expect(options).toBeDefined();
    
    // Test the different scenarios for fully coverage the tooltip of the LineChart
    let contextForTitleCallback = [{ dataset: { label: 'labelMock' } }];
    let titleResult = options.plugins.tooltip.callbacks.title(contextForTitleCallback);
    expect(titleResult).toBe('labelMock');

    let contextForLabelCallback = { raw: 'mockRaw' };
    let labelResult = options.plugins.tooltip.callbacks.label(contextForLabelCallback);
    expect(labelResult).toBe('average_cpu mockRaw');
  });
});