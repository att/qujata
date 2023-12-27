import { render } from '@testing-library/react';
import { ExperimentTable } from './ExperimentTable';
import { MOCK_DATA_FOR_EXPERIMENT_TABLE, MOCK_DATA_FOR_EXPERIMENT_WITH_NO_TEST_RUNS } from '../__mocks__/mocks';

jest.mock('../hooks/useExperimentData');

describe('ExperimentTable', () => {
    test('should render ExperimentTable', async () => {
      const { container } = render(<ExperimentTable {...MOCK_DATA_FOR_EXPERIMENT_TABLE} />);

      expect(container).toBeTruthy();
    });

    test('should render ExperimentTable with no data', async () => {
      const { container } = render(<ExperimentTable {...MOCK_DATA_FOR_EXPERIMENT_WITH_NO_TEST_RUNS} />);

      expect(container).toBeTruthy();
    });
});
