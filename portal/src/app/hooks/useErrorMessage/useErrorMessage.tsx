import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { attToast } from '../../shared/components/toast/att-toast.service';
import { IServerError } from '../../shared/models/server-error.interface';

export function useErrorMessage(error?: AxiosError<IServerError>): void {
  useEffect(() => {
    if (error) {
      attToast.error(error?.response?.data?.message as string, error?.response?.data?.error as string, undefined);
    }
  }, [error]);
}
