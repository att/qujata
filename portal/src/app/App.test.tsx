import { render, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('should render App', async () => {
    const { container } = render(<App />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
