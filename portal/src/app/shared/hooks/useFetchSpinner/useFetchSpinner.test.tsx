import { renderHook } from '@testing-library/react-hooks';
import { useFetchSpinner } from './useFetchSpinner';
import { FetchDataStatus } from '../useFetch';
import { useSpinnerContext } from '../../context/spinner';

jest.mock('../../context/spinner');

describe('useFetchSpinner', () => {
  let setSpinner: jest.Mock<any, any>;

  beforeEach(() => {
    setSpinner = jest.fn();
    const contextData = { setSpinner };
    (useSpinnerContext as jest.Mock).mockImplementation(() => (contextData));
  })

  test('should set spinner as false for single status Init', () => {
    renderHook(() => useFetchSpinner(FetchDataStatus.Init));
    expect(setSpinner).toHaveBeenCalledWith(false);
  });

  test('should set spinner as false for single status Success', () => {
    renderHook(() => useFetchSpinner(FetchDataStatus.Success));
    expect(setSpinner).toHaveBeenCalledWith(false);
  });

  test('should set spinner as false for single status Error', () => {
    renderHook(() => useFetchSpinner(FetchDataStatus.Error));
    expect(setSpinner).toHaveBeenCalledWith(false);
  });

  test('should set spinner as false for single status Canceled', () => {
    renderHook(() => useFetchSpinner(FetchDataStatus.Canceled));
    expect(setSpinner).toHaveBeenCalledWith(false);
  });

  test('should set spinner as true for single status Fetching', () => {
    renderHook(() => useFetchSpinner(FetchDataStatus.Fetching));
    expect(setSpinner).toHaveBeenCalledWith(true);
  });

  test('should set spinner as false when Fetching in silent mode', () => {
    renderHook(() => useFetchSpinner(FetchDataStatus.Fetching, true));
    expect(setSpinner).toHaveBeenCalledWith(false);
  });

  test('should set spinner as true when Fetching and silent mode is off', () => {
    renderHook(() => useFetchSpinner(FetchDataStatus.Fetching, false));
    expect(setSpinner).toHaveBeenCalledWith(true);
  });
});
