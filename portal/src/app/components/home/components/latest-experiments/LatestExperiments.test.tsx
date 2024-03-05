import { fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LatestExperiments } from './LatestExperiments';
import { FetchDataStatus } from '../../../../shared/hooks/useFetch';
import { useExperimentsData } from '../../../all-experiments/hooks';
import { MOCK_DATA_FOR_ALL_EXPERIMENTS } from '../../../all-experiments/__mocks__/mocks';
import { QujataInsight, QujataInsightsProps } from '../../../../shared/components/qujata-insight';

jest.mock('../../../all-experiments/hooks');
jest.mock('../../../../shared/components/qujata-insight');

describe('LatestExperiments', () => {
  beforeEach(() => {
    (useExperimentsData as jest.Mock).mockReturnValue({
      testSuites: MOCK_DATA_FOR_ALL_EXPERIMENTS,
      status: FetchDataStatus.Success,
    });
  });

  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <LatestExperiments />
      </BrowserRouter>
    );
  });

  test('should click on close insight button', async () => {
    (QujataInsight as jest.Mock).mockImplementation((props: QujataInsightsProps) => {
      function onInsightClose() {
        props.onInsightClose();
      }
      return <div onClick={onInsightClose} data-testid='close-id'>QujataInsight</div>;
    });

    const { container, getByTestId } = render(
      <BrowserRouter>
        <LatestExperiments />
      </BrowserRouter>
    );
    const submitButtonElement: HTMLElement = getByTestId('close-id');

    await waitFor(() => {
      expect(container).toBeTruthy();
    });

    await waitFor(() => {
      fireEvent.click(submitButtonElement);
    });
  });
});
