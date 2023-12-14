import { act, renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { FetchDataStatus, useFetch } from '../shared/hooks/useFetch';
import { useDashboardData } from './useDashboardData';
import { ITestParams } from '../shared/models/quantum.interface';

jest.mock('../shared/hooks/useFetch');
  
describe('useDashboardData', () => {
  test('Should show error message for Error mode', async () => {
    (useFetch as jest.Mock).mockReturnValue({
      error: { message: 'error' },
      status: FetchDataStatus.Error,
      post: jest.fn(),
      cancelRequest: jest.fn(),
    });
    renderHook(() => useDashboardData());
    await waitFor(() => {
      expect('error').toBeTruthy();
    });
  });

  test('Should be in Success mode', () => {
    const mockData = { linkToResult: { from: '1698747472962', to: '1698747480624' } };
    (useFetch as jest.Mock).mockReturnValue({
      status: FetchDataStatus.Success,
      post: jest.fn(),
      cancelRequest: jest.fn(),
      data: mockData,
    });
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.status).toEqual(FetchDataStatus.Success);
  });

  it('calls the appropriate functions when handleRunQueryClick is called', () => {
    const post = jest.fn();

    // Mock the return value of useFetch
    (useFetch as jest.Mock).mockReturnValue({
      post,
      data: null,
      status: FetchDataStatus.Init,
      error: null,
      cancelRequest: jest.fn(),
    });

    const { result } = renderHook(() => useDashboardData());

    const testData: ITestParams = {
      experimentName: 'test',
      algorithms: [{ label: 'algo1', value: 'algo1' }, { label: 'algo2', value: 'algo2' }, { label: 'algo3', value: 'algo3' }, { label: 'algo4', value: 'algo4' }],
      iterationsCount: [{ label: '1000', value: '1000' }],
      description: 'test'
    };

    act(() => {
      result.current.handleRunQueryClick(testData);
    });

    expect(post).toHaveBeenCalledWith({
      data: {
        experimentName: 'test',
        algorithms: ['algo1', 'algo2', 'algo3', 'algo4'],
        iterationsCount: [1000],
        description: 'test'
      }
    });
  });
});
