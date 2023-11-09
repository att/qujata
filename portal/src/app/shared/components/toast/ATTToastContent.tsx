import { PropsWithChildren } from 'react';
import { ToastContentProps } from 'react-toastify';
import styles from './ATTToastContent.module.scss';

export interface ATTToastBasicContentProps {
  title: string;
  message: string;
}

type ATTToastContentProps = ATTToastBasicContentProps & ToastContentProps<unknown>;

export const ATTToastContent: React.FC<PropsWithChildren<ATTToastContentProps>> = ({ message, title, children }: PropsWithChildren<ATTToastContentProps>) => (
  <div className={styles.toast_wrapper}>
    <div className={styles.toast_content}>
      {title && <div className={styles.toast_title}>{title}</div>}
      <div className={styles.toast_message}>{message}</div>
      {children}
    </div>
  </div>
);
