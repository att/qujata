import { Id, ToastOptions } from 'react-toastify';

export enum SeverityType {
  ERROR = 'error',
  ISSUE = 'issue',
  INFO = 'info',
  WARNING = 'warning',
}
export interface IServerError {
  ticket: string;
  code: number;
  message: string;
  variables: string[];
  severity?: SeverityType;
  description?: string;
}

export type TATTToast = (message: string, title?: string, options?: ToastOptions, children?: React.ReactNode) => Id;
