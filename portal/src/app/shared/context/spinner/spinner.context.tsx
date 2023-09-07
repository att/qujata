import { Context, createContext, Provider, useContext } from 'react';
import { ISpinner } from './spinner.interface';

const defaultData: ISpinner = { isSpinnerOn: false, setSpinner: (): void => undefined };

const SpinnerContext: Context<ISpinner> = createContext<ISpinner>(defaultData);
export const SpinnerProvider: Provider<ISpinner> = SpinnerContext.Provider;
export const useSpinnerContext: () => ISpinner = () => useContext<ISpinner>(SpinnerContext);
