import { renderHook } from '@testing-library/react-hooks';
import { useFetchSpinner } from './useFetchSpinner';
import { FetchDataStatus } from '../useFetch';
import { useSpinnerContext } from '../../context/spinner';

jest.mock('src/app/shared/context/spinner');

describe('useFetchSpinner', () => {
  let setSpinner: jest.Mock<any, any>;

  beforeEach(() => {
    setSpinner = jest.fn();
    const contextData = { setSpinner };
    (useSpinnerContext as jest.Mock).mockImplementation(() => (contextData));
  })

  test('should set spinner as false for single status Init', () => {
    renderHook(() => useFetchSpinner('uniqueKey', FetchDataStatus.Init));
    expect(setSpinner).toHaveBeenCalledWith('uniqueKey', false);
  });

  test('should set spinner as false for single status Success', () => {
    renderHook(() => useFetchSpinner('uniqueKey', FetchDataStatus.Success));
    expect(setSpinner).toHaveBeenCalledWith('uniqueKey', false);
  });

  test('should set spinner as false for single status Error', () => {
    renderHook(() => useFetchSpinner('uniqueKey', FetchDataStatus.Error));
    expect(setSpinner).toHaveBeenCalledWith('uniqueKey', false);
  });

  test('should set spinner as false for single status Canceled', () => {
    renderHook(() => useFetchSpinner('uniqueKey', FetchDataStatus.Canceled));
    expect(setSpinner).toHaveBeenCalledWith('uniqueKey', false);
  });

  test('should set spinner as true for single status Fetching', () => {
    renderHook(() => useFetchSpinner('uniqueKey', FetchDataStatus.Fetching));
    expect(setSpinner).toHaveBeenCalledWith('uniqueKey', true);
  });

  test('should set spinner as false when Fetching in silent mode', () => {
    renderHook(() => useFetchSpinner('uniqueKey', FetchDataStatus.Fetching, true));
    expect(setSpinner).toHaveBeenCalledWith('uniqueKey', false);
  });

  test('should set spinner as true when Fetching and silent mode is off', () => {
    renderHook(() => useFetchSpinner('uniqueKey', FetchDataStatus.Fetching, false));
    expect(setSpinner).toHaveBeenCalledWith('uniqueKey', true);
  });
});
