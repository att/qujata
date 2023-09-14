import { ReactNode, useCallback, useState } from 'react';
import { ISpinner } from './spinner.interface';
import { SpinnerProvider } from './spinner.context';

export const SpinnerProviderWrapper: React.FC<{ children: ReactNode }> = (props: { children: ReactNode }) => {
  const [isSpinnerOn, setIsSpinnerOn] = useState<boolean>(false);

  const setSpinner: (isActive: boolean) => void = useCallback((isActive: boolean) => {
    setIsSpinnerOn(isActive);
  }, []);

  const data: ISpinner = { isSpinnerOn, setSpinner };

  return (
    <SpinnerProvider value={data}>
      {props.children}
    </SpinnerProvider>
  );
};
