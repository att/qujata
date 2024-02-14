import { renderHook } from '@testing-library/react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { useMessageSizeData } from './useMessageSizeData';

jest.mock('../../../shared/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}));
  
describe('useMessageSizeData', () => {
  test('Should be in Success mode', () => {
    const mockData = {
      message_sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };

    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: mockData,
      cancelRequest: jest.fn(),
    });

    const { result } = renderHook(() => useMessageSizeData());
    expect(result.current.messageSizeOptions.length).toEqual(mockData.message_sizes.length + 2);
  });
});