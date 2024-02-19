import { render, waitFor } from '@testing-library/react';
import { LatestExperiments } from './LatestExperiments';

describe('LatestExperiments', () => {
  test('should render LatestExperiments', async () => {
    const { container } = render(<LatestExperiments />);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
