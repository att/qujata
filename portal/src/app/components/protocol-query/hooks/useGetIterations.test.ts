import { renderHook } from '@testing-library/react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { useGetIterations } from './useGetIterations';

jest.mock('../../../shared/hooks/useFetch', () => ({
  useFetch: jest.fn(),
}));
  
describe('useGetIterations', () => {
  test('Should be in Success mode', () => {
    const mockData = {
      iterations: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };

    (useFetch as jest.Mock).mockReturnValue({
      get: jest.fn(),
      data: mockData,
      cancelRequest: jest.fn(),
    });

    const { result } = renderHook(() => useGetIterations());
    expect(result.current.iterationsOptions.length).toEqual(mockData.iterations.length + 2);
  });
});