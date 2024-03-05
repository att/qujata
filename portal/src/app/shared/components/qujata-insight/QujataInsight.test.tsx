import { render, RenderResult, waitFor } from '@testing-library/react';
import { QujataInsight, QujataInsightsProps } from './QujataInsight';

describe('QujataInsight', () => {
  let qujataInsightProps: QujataInsightsProps;

  beforeEach(() => {
    qujataInsightProps = {
      closeImageUrl: 'closeImageUrl',
      description: 'description',
      linkName: 'linkName',
      linkUrl: 'linkUrl',
      onInsightClose: jest.fn(),
      title: 'title',
      imageUrl: 'imageUrl'
    };
  });

  test('should render QujataInsight correctly', async () => {
    const { container }: RenderResult = render(<QujataInsight { ...qujataInsightProps } />);

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});