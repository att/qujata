import { ReactNode } from 'react';
import { SpinnerProviderWrapper } from './spinner';

export const RootContextState: React.FC<{children: ReactNode}> = (props: {children: ReactNode}) => (
  <SpinnerProviderWrapper>
    {props.children}
  </SpinnerProviderWrapper>
);
