import { render, fireEvent, waitFor } from '@testing-library/react';
import { SelectColumnsPopup, SelectColumnsPopupProps } from './SelectColumnsPopup';
import { SelectedColumnsDefaultData } from '../../constants/table-options.const';
import { SELECT_COLUMNS_EN } from './translate/en';

const mockOnPopupClose = jest.fn();
const mockOnColumnsSelected = jest.fn();
let selectColumnsPopupProps: SelectColumnsPopupProps;

describe('SelectColumnsPopup', () => {
  beforeAll(() => {
    selectColumnsPopupProps = {
      data: SelectedColumnsDefaultData,
      onPopupClose: mockOnPopupClose,
      onColumnsSelected: mockOnColumnsSelected,
    };
  });

  test('renders correctly', () => {
    const { getByText } = render(<SelectColumnsPopup {...selectColumnsPopupProps} />);

    expect(getByText(SelectedColumnsDefaultData[0].value)).toBeInTheDocument();
    expect(getByText(SelectedColumnsDefaultData[1].value)).toBeInTheDocument();
    expect(getByText(SelectedColumnsDefaultData[2].value)).toBeInTheDocument();
  });

  test('handles column selection', () => {
    const { getByTestId } = render(<SelectColumnsPopup {...selectColumnsPopupProps} />);
    const iterationsCheckbox = getByTestId('iterations-checkbox');
    const resultsAverageCPUCheckbox = getByTestId('results.averageCPU-checkbox');

    fireEvent.click(iterationsCheckbox);
    fireEvent.click(resultsAverageCPUCheckbox);

    expect((iterationsCheckbox as HTMLInputElement).checked).toBe(true);
    expect((resultsAverageCPUCheckbox as HTMLInputElement).checked).toBe(true);
  });

  test('handles popup close', () => {
    const { getByAltText } = render(<SelectColumnsPopup {...selectColumnsPopupProps} />);

    fireEvent.click(getByAltText('Close'));

    expect(mockOnPopupClose).toHaveBeenCalled();
  });

  test('handles save click', () => {
    const { getByText } = render(<SelectColumnsPopup {...selectColumnsPopupProps} />);

    fireEvent.click(getByText(SELECT_COLUMNS_EN.SAVE));

    expect(mockOnColumnsSelected).toHaveBeenCalledWith(SelectedColumnsDefaultData);
    expect(mockOnPopupClose).toHaveBeenCalled();
  });

  test('handles reset to default', () => {
    const { getByText, getByTestId } = render(<SelectColumnsPopup {...selectColumnsPopupProps} />);
    const iterationsCheckbox = getByTestId('iterations-checkbox');
  
    fireEvent.click(getByText(SELECT_COLUMNS_EN.RESET_TO_DEFAULT));
  
    expect((iterationsCheckbox as HTMLInputElement).checked).toBe(false);
  });
});