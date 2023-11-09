import { Slide, ToastContainerProps } from 'react-toastify';

export const ToastContainerConfig: ToastContainerProps = {
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: true,
  newestOnTop: true,
  closeOnClick: false,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  transition: Slide,
  icon: false,
  theme: 'light',

  className: 'att-toasts-container',
  toastClassName: 'att-toast-container',
  bodyClassName: 'att-toast-content',
};

export const ToastErrorDefaultConfig: ToastContainerProps = {
  autoClose: 15000,
};
