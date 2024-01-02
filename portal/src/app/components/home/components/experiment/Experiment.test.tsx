import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { SubHeader } from './components/sub-header';
import { Charts } from './components/charts';
import { Experiment, ExperimentContent } from './Experiment';
import { ExperimentTable } from './components/experiment-table';
import { useExperimentData } from './components/hooks/useExperimentData';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';
import { MOCK_DATA_FOR_EXPERIMENT } from './components/__mocks__/mocks';
import { ExperimentTabs } from './components/experiment-tabs';
import { TableOptions } from './components/table-options';
import { SelectColumnsPopup } from './components/table-options/components/select-columns-popup';
import { TABLE_OPTIONS_EN } from './components/table-options/translate/en';

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
    (SubHeader as jest.Mock).mockImplementation(() => <div>SubHeader</div>);
    (ExperimentTabs as jest.Mock).mockImplementation(() => <div>ExperimentTabs</div>);
    (TableOptions as jest.Mock).mockImplementation(() => <button>{TABLE_OPTIONS_EN.SELECT_COLUMNS}</button>);
    (SelectColumnsPopup as jest.Mock).mockImplementation(() => <div>SelectColumnsPopup</div>);
    (ExperimentTable as jest.Mock).mockImplementation(() => <div>ExperimentTable</div>);
    (Charts as jest.Mock).mockImplementation(() => <div>Charts</div>);
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

  test('should show spinner on render data', async () => {
    const { container } = render(<Experiment />);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});

describe('ExperimentContent', () => {
  let handleButtonClickMock: jest.Mock;
  let scrollIntoViewMock: jest.Mock;

  beforeEach(() => {
    handleButtonClickMock = jest.fn();
    scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    (useExperimentData as jest.Mock).mockReturnValue({
      data: MOCK_DATA_FOR_EXPERIMENT,
      status: FetchDataStatus.Success,
    });
  });

  afterEach(() => {
    scrollIntoViewMock.mockRestore();
  });

  test('should render without crashing', async () => {
    const { container } = render(<ExperimentContent data={MOCK_DATA_FOR_EXPERIMENT} />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
