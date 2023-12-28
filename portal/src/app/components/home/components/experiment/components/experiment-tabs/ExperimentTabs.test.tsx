import { fireEvent, render } from '@testing-library/react';
import { ExperimentTabs, ExperimentTabsProps } from './ExperimentTabs';
import { EXPERIMENT_EN } from '../../translate/en';

describe('ExperimentTabs', () => {
  const experimentTabsProps: ExperimentTabsProps = {
    currentSection: 'Results Data',
    handleButtonClick: jest.fn(),
  };
  
  test('should render ExperimentTabs', () => {
    const { container } = render(<ExperimentTabs {...experimentTabsProps} />);

    expect(container).toBeTruthy();
  });

  test('should call handleButtonClick with the correct section when a button is clicked', () => {
    const mockHandleButtonClick = jest.fn();
    const { getByText } = render(
      <ExperimentTabs 
        currentSection={EXPERIMENT_EN.TABS.RESULTS_DATA} 
        handleButtonClick={mockHandleButtonClick} 
      />
    );

    fireEvent.click(getByText(EXPERIMENT_EN.TABS.RESULTS_DATA));

    expect(mockHandleButtonClick).toHaveBeenCalledWith(EXPERIMENT_EN.TABS.RESULTS_DATA);
  });
});
