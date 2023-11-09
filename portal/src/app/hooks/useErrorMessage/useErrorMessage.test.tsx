import { renderHook } from '@testing-library/react';
import { useErrorMessage } from './useErrorMessage';
import { AxiosError } from 'axios';
import { attToast } from '../../shared/components/toast/att-toast.service';
import { IServerError } from '../../shared/models/server-error.interface';

jest.mock('src/app/utils/server-error-message');

describe('useErrorMessage', () => {
  test('should show error message when we receive error from BE', () => {
    const error: AxiosError<IServerError> = {} as AxiosError<IServerError>;
    renderHook(() => useErrorMessage(error));
    attToast.error(error.message, 'Error', undefined);
  });

  test('should not show error message when no error provided', () => {
    renderHook(() => useErrorMessage());
    expect(attToast.error).not.toHaveBeenCalled();
  });

});
