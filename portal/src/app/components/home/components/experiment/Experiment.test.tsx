import { fireEvent, render, waitFor } from '@testing-library/react';
import { SubHeader } from './components/sub-header';
import { Charts } from './components/charts';
import { Experiment, ExperimentContent } from './Experiment';
import { ExperimentTable } from './components/experiment-table';
import { useExperimentData } from './components/hooks/useExperimentData';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';
import { MOCK_DATA_FOR_EXPERIMENT } from './components/__mocks__/mocks';
import { ExperimentTabs, ExperimentTabsProps } from './components/experiment-tabs';
import { TableOptions, TableOptionsProps } from './components/table-options';
import { SelectColumnsPopup, SelectColumnsPopupProps } from './components/table-options/components/select-columns-popup';
import { TABLE_OPTIONS_EN } from './components/table-options/translate/en';
import { EXPERIMENT_EN } from './translate/en';
import React from 'react';

jest.mock('./components/hooks/useExperimentData');
jest.mock('./components/sub-header');
jest.mock('./components/experiment-tabs');
jest.mock('./components/table-options');
jest.mock('./components/table-options/components/select-columns-popup');
jest.mock('./components/experiment-table');
jest.mock('./components/charts', () => ({
  Charts: jest.fn(),
}));

describe('Experiment', () => {
  beforeEach(() => {
    (useExperimentData as jest.Mock).mockReturnValue({
      data: MOCK_DATA_FOR_EXPERIMENT,
      status: FetchDataStatus.Success,
    });

    global.IntersectionObserver = class IntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];
      disconnect: () => void = jest.fn();
      observe: (target: Element) => void = jest.fn();
      unobserve: (target: Element) => void = jest.fn();
      takeRecords: () => IntersectionObserverEntry[] = jest.fn();
    };
  });

  test('should render Experiment', async () => {
    const { container } = render(<Experiment />);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});

describe('ExperimentContent', () => {
  let scrollIntoViewMock: jest.Mock;

  beforeEach(() => {
    scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    (useExperimentData as jest.Mock).mockReturnValue({
      data: MOCK_DATA_FOR_EXPERIMENT,
      status: FetchDataStatus.Success,
    });
    (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
    (ExperimentTabs as jest.Mock).mockImplementation((props: ExperimentTabsProps) => {
      function handleResultsDataClick() {
        props.handleButtonClick(EXPERIMENT_EN.TABS.RESULTS_DATA);
      }
      function handleVisualizationClick() {
        props.handleButtonClick(EXPERIMENT_EN.TABS.VISUALIZATION);
      }
      function handleNietherClick() {
        props.handleButtonClick('Not Results Data or Visualization');
      }
      return (
        <>
          <div onClick={handleResultsDataClick} data-testid='results_data_button'>{EXPERIMENT_EN.TABS.RESULTS_DATA}</div>
          <div onClick={handleVisualizationClick} data-testid='visualization_button'>{EXPERIMENT_EN.TABS.VISUALIZATION}</div>
          <div onClick={handleNietherClick} data-testid='neither_results_data_nor_visualization'>Not Results Data or Visualization</div>
        </>
      )
    });
    (TableOptions as jest.Mock).mockImplementation((props: TableOptionsProps) => {
      function handleSelectColumnsClick() {
        props.handleSelectColumnsClick();
      }
      return <div onClick={handleSelectColumnsClick} data-testid='table_options'>TableOptions</div>
    });
    (SelectColumnsPopup as jest.Mock).mockImplementation((props: SelectColumnsPopupProps) => {
      function onPopupClose() {
        props.onPopupClose();
      }
      return <div onClick={onPopupClose} data-testid='select_columns_button'>{TABLE_OPTIONS_EN.SELECT_COLUMNS}</div>
    });
    (ExperimentTable as jest.Mock).mockImplementation(() => <div>ExperimentTable</div>);
    (Charts as jest.Mock).mockImplementation(() => <div>Charts</div>);
  });

  test('should render without crashing', async () => {
    const { container, getByTestId } = render(<ExperimentContent data={MOCK_DATA_FOR_EXPERIMENT} />);
    fireEvent.click(getByTestId('results_data_button'));
    fireEvent.click(getByTestId('visualization_button'));
    fireEvent.click(getByTestId('neither_results_data_nor_visualization'));
    fireEvent.click(getByTestId('table_options'));
    fireEvent.click(getByTestId('select_columns_button'));

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should close the select columns popup when clicking outside', () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(() => [true, setState]);

    render(<ExperimentContent data={MOCK_DATA_FOR_EXPERIMENT} />);
    fireEvent.mouseDown(document);

    expect(setState).toHaveBeenCalledWith(false);
  });
});
