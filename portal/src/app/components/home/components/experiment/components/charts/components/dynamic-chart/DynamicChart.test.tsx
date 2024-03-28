import { render } from '@testing-library/react';
import { useDynamicChartData } from './hooks/useDynamicChartData';
import { BarChart } from '../../../../../../../dashboard/components/charts/BarChart/BarChart';
import { LineChart } from '../../../../../../../dashboard/components/charts/LineChart/LineChart';

jest.mock('../../../../../../../dashboard/components/charts/BarChart/BarChart');
jest.mock('../../../../../../../dashboard/components/charts/LineChart/LineChart');
jest.mock('../../../../../../../../shared/components/att-select/AttSelect', () => ({
    AttSelect: jest.fn(() => <div>Mocked AttSelect</div>),
}));
jest.mock('./hooks/useDynamicChartData');

describe('DynamicChart', () => {
    test('should render Charts', async () => {
        (BarChart as jest.Mock).mockImplementation(() => <div>BarChart</div>);
        (LineChart as jest.Mock).mockImplementation(() => <div>LineChart</div>);


      (useDynamicChartData as jest.Mock).mockReturnValue({
        yAxiosOptions: [{
            label: 'averageCPU',
            value: 'averageCPU'
        },
        {
            label: 'averageMemory',
            value: 'averageMemory'
        }],
        });

      const { container } = render(<BarChart titleX='Iterations' titleY='Bytes Throughput' labels={[]} data={undefined} keyOfData={''} tooltipKeys={[]} tooltipLabels={[]} />);
      expect(container).toBeTruthy();
    });
});
