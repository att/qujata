import { render, fireEvent, waitFor } from '@testing-library/react';
import { SelectColumnsPopup, SelectColumnsPopupProps } from './SelectColumnsPopup';
import { SelectedColumnsDefaultData } from '../../constants/table-options.const';
import { SELECT_COLUMNS_EN } from './translate/en';


describe('SelectColumnsPopup', () => {
  const mockOnPopupClose = jest.fn();
  const mockOnColumnsSelected = jest.fn();
  let selectColumnsPopupProps: SelectColumnsPopupProps;

  beforeAll(() => {
    selectColumnsPopupProps = {
      data: SelectedColumnsDefaultData,
      onPopupClose: mockOnPopupClose,
      onColumnsSelected: mockOnColumnsSelected,
      selectedColumns: SelectedColumnsDefaultData
    };
  });

  test('renders correctly', async () => {
    const { container } = render(<SelectColumnsPopup {...selectColumnsPopupProps} />);
    
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('handles column selection', () => {
    const { getByTestId } = render(<SelectColumnsPopup {...selectColumnsPopupProps} />);
    const iterationsCheckboxImage = getByTestId('iterations-checkbox-image');
    const iterationsCheckbox = getByTestId('iterations-checkbox');
    const resultsAverageCPUCheckbox = getByTestId('results.average_cpu-checkbox');

    fireEvent.click(iterationsCheckboxImage);
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