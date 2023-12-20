import { render } from '@testing-library/react';
import { Charts } from './Charts';
import { useChartsData } from './hooks/useChartsData';
import { BarChart } from '../../../../../dashboard/components/charts/BarChart';
import { LineChart } from '../../../../../dashboard/components/charts/LineChart';
import { MOCK_DATA_FOR_BAR_CHART, MOCK_DATA_FOR_BAR_CHART_LABELS, MOCK_DATA_FOR_BAR_CHART_KEYS, MOCK_DATA_FOR_LINE_CHART, MOCK_DATA_FOR_CHARTS } from './__mocks__';

jest.mock('./hooks/useChartsData');
jest.mock('../../../../../dashboard/components/charts/BarChart');
jest.mock('../../../../../dashboard/components/charts/LineChart');

describe('Charts', () => {
    test('should render Charts', async () => {
        (BarChart as jest.Mock).mockImplementation(() => <div>BarChart</div>);
        (LineChart as jest.Mock).mockImplementation(() => <div>LineChart</div>);

      (useChartsData as jest.Mock).mockReturnValue({
        barChartData: MOCK_DATA_FOR_BAR_CHART,
        barChartLabels: MOCK_DATA_FOR_BAR_CHART_LABELS,
        barChartKeysOfData: MOCK_DATA_FOR_BAR_CHART_KEYS,
        lineChartData: MOCK_DATA_FOR_LINE_CHART
        });

      const { container } = render(<Charts { ...MOCK_DATA_FOR_CHARTS } />);
      expect(container).toBeTruthy();
    });
});
