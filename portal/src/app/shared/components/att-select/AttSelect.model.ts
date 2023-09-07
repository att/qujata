// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AttSelectOption<T = any> {
    value: string;
    label: string;
    metadata?: T;
    isDisabled?: boolean,
}

export enum AttSelectTheme {
    REGULAR = 'regular',
    PRIMARY = 'primary',
    WRAPPER = 'wrapper',
}
