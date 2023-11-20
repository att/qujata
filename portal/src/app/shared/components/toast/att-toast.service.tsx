import { Id, toast, ToastContentProps, ToastOptions } from 'react-toastify';
import { SHARED_EN } from '../../translate/en';
import { ToastErrorDefaultConfig } from './toast-container-config.const';
import { ATTToastBasicContentProps, ATTToastContent } from './ATTToastContent';

interface IToastService {
  error: (message: string, title?: string, options?: ToastOptions, children?: React.ReactNode) => Id;
  success: (message: string, title?: string, options?: ToastOptions) => Id;
  info: (message: string, title?: string, options?: ToastOptions) => Id;
  warning: (message: string, title?: string, options?: ToastOptions, children?: React.ReactNode) => Id;
}

export const attToast: IToastService & Omit<typeof toast, 'error'|'success'|'info'|'warning'> = {
  ...toast,
  error: (message: string, title?: string, options?: ToastOptions, children?: React.ReactNode): Id => {
    const basicProps: ATTToastBasicContentProps = getBasicProps(message, title);
    const errorOptions: ToastOptions = { ...ToastErrorDefaultConfig, ...options };
    return toast.error(getATTToastContent(basicProps, children), errorOptions);
  },
  success: (message: string, title?: string, options?: ToastOptions): Id => {
    const basicProps: ATTToastBasicContentProps = getBasicProps(message, title || SHARED_EN.TOAST_DESCRIPTIONS.SUCCESS);
    return toast.success(getATTToastContent(basicProps), options);
  },
  info: (message: string, title?: string, options?: ToastOptions, children?: React.ReactNode): Id => {
    const basicProps: ATTToastBasicContentProps = getBasicProps(message, title);
    return toast.info(getATTToastContent(basicProps, children), options);
  },
  warning: (message: string, title?: string, options?: ToastOptions, children?: React.ReactNode): Id => {
    const basicProps: ATTToastBasicContentProps = getBasicProps(message, title);
    return toast.warning(getATTToastContent(basicProps, children), options);
  },
};

function getBasicProps(message: string, title: string | undefined): ATTToastBasicContentProps {
  return { title: title || '', message };
}

function getATTToastContent(basicProps:ATTToastBasicContentProps, children?: React.ReactNode): (props: ToastContentProps<unknown>) => React.ReactNode {
  return function renderEdaToastContent(props: ToastContentProps<unknown>): React.ReactNode {
    return <ATTToastContent {...props} {...basicProps}>{children}</ATTToastContent>;
  };
}
