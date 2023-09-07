import { ReactNode, MutableRefObject, useRef, useCallback, useState } from 'react';
import { ISpinner } from './spinner.interface';
import { SpinnerProvider } from './spinner.context';

export const SpinnerProviderWrapper: React.FC<{ children: ReactNode }> = (props: { children: ReactNode }) => {
  const activeRequests: MutableRefObject<Set<string>> = useRef(new Set<string>());
  const [isSpinnerOn, setIsSpinnerOn] = useState<boolean>(false);

  const setSpinner: (uniqueKey: string, isActive: boolean) => void = useCallback((uniqueKey: string, isActive: boolean) => {
    if (isActive) {
      activeRequests.current.add(uniqueKey);
    } else {
      activeRequests.current.delete(uniqueKey);
    }
    setIsSpinnerOn(!!activeRequests.current.size);
  }, []);

  const data: ISpinner = { isSpinnerOn, setSpinner };

  return (
    <SpinnerProvider value={data}>
      {props.children}
    </SpinnerProvider>
  );
};
