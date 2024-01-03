import { RenderResult, fireEvent, render } from '@testing-library/react';
import { TableOptions, TableOptionsProps } from './TableOptions';
import { MOCK_DATA_FOR_EXPERIMENT, MOCK_DATA_FOR_EXPERIMENT_WITH_NO_TEST_RUNS } from '../__mocks__/mocks';
import { ITestRunResult } from '../../../../../../shared/models/test-run-result.interface';
import { TABLE_OPTIONS_EN } from './translate/en';

jest.mock('../hooks/useExperimentData');

describe('TableOptions', () => {
  const mockHandleSelectColumnsClick = jest.fn();
  const mockData: ITestRunResult = MOCK_DATA_FOR_EXPERIMENT;

  const props: TableOptionsProps = {
    data: mockData,
    handleSelectColumnsClick: mockHandleSelectColumnsClick,
    isPopupOpen: false,
  };
  
  it('renders without crashing', () => {
    const { container }: RenderResult = render(<TableOptions {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls handleSelectColumnsClick when the button is clicked', () => {
    const { getByLabelText } = render(<TableOptions {...props} />);
    const button = getByLabelText(TABLE_OPTIONS_EN.SELECT_COLUMNS);

    fireEvent.click(button);

    expect(mockHandleSelectColumnsClick).toHaveBeenCalled();
  });
});
