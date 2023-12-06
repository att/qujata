import { renderHook } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import {SpinnerProvider, useSpinnerContext} from './spinner.context';

describe('Spinner Context', () => {
    test('should context have default values', () => {
        const { result } = renderHook(() => useSpinnerContext());
        expect(result.current.isSpinnerOn).toBe(false);
        expect(result.current.setSpinner(false)).toBe(undefined);
    });

    test('should context have init provider values', () => {
        const setSpinner = () => undefined;
        const value = { isSpinnerOn: true, setSpinner };
        const Wrapper = (props: PropsWithChildren<{ }>) => (<SpinnerProvider value={ value }>{props.children}</SpinnerProvider>);
        const { result } = renderHook(() => useSpinnerContext(), { wrapper: Wrapper });
        expect(result.current.isSpinnerOn).toBe(true);
        expect(result.current.setSpinner).toBe(setSpinner);
    });
});
