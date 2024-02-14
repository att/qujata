import { RenderResult, render } from '@testing-library/react';
import { LineChart, generateTooltipTitle, renderTooltipLabel } from './LineChart';
import { PointElement, TooltipItem } from 'chart.js';

jest.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="chart">Chart</div>, // add data-testid attribute
    Line: () => <div data-testid="line2">Line</div>, // add any additional components you want to mock here
}));
jest.mock('chart.js');

const mockData = {
    datasets: [
        {
            backgroundColor: "#05BBFF",
            borderColor: "#05BBFF",
            borderWidth: 1,
            data: [1,2,3,4],
            fill: false,
            label: "Algorithm1",
        }
    ],
    labels: [12, 14, 23, 104, 200, 300, 1024],
}

describe('LineChart', () => {
    test('renders LineChart', () => {
        const { getByTestId }: RenderResult = render(<LineChart data={mockData} title='title' tooltipLabel='average_cpu' />);
        const chartElement: HTMLElement = getByTestId('line2');
        expect(chartElement).toBeTruthy();
    });

    test('should render tooltip title', () => {
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

      describe('tooltip configuration', () => {
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
      });
});