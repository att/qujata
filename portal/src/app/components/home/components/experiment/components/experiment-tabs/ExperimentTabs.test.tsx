import { render } from '@testing-library/react';
import { ExperimentTabs, ExperimentTabsProps } from './ExperimentTabs';

describe('ExperimentTabs', () => {
  const experimentTabsProps: ExperimentTabsProps = {
    currentSection: 'Results Data',
    handleButtonClick: jest.fn(),
  };
  
  test('should render ExperimentTabs', () => {
    const { container } = render(<ExperimentTabs {...experimentTabsProps} />);

    expect(container).toBeTruthy();
  });
});
