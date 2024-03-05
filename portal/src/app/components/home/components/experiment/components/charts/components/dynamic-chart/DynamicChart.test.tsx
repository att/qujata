import { fireEvent, render } from '@testing-library/react';
import { useDynamicChartData } from './hooks/useDynamicChartData';
import { BarChart } from '../../../../../../../dashboard/components/charts/BarChart/BarChart';
import { LineChart } from '../../../../../../../dashboard/components/charts/LineChart/LineChart';
import { AttSelectProps } from '../../../../../../../../shared/components/att-select';
import { DynamicChart } from './DynamicChart';
import { MOCK_DATA_FOR_EXPERIMENT } from '../../../__mocks__/mocks';

jest.mock('../../../../../../../dashboard/components/charts/BarChart/BarChart');
jest.mock('../../../../../../../dashboard/components/charts/LineChart/LineChart');
jest.mock('./hooks/useDynamicChartData');
jest.mock('../../../../../../../../shared/components/att-select/AttSelect', () => {
    return {
      __esModule: true,
      AttSelect: (props: AttSelectProps) => {
        function onChange() {
          props.onChange({ label: 'averageCPU', value: 'averageCPU' });
        }
        
        return <div onClick={onChange} data-testid='att_select_options'>Options</div>;
      },
    };
});

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
        const { container, getAllByTestId } = render(
            <DynamicChart
                chartData={MOCK_DATA_FOR_EXPERIMENT}
                xDefaultOption={{ label: 'test', value: 'test' }}
                yDefaultOption={{ label: 'test', value: 'test' }}
                chartDefaultType={{ label: 'test', value: 'test'}}
            />
        );
        
        const optionsElements: HTMLElement[] = getAllByTestId('att_select_options');
        optionsElements.forEach((element) => {
          fireEvent.click(element);
        });
        
        expect(container).toBeTruthy();
    });
});
