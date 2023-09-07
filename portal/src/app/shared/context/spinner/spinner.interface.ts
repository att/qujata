export interface ISpinner {
    isSpinnerOn: boolean,
    setSpinner:(uniqueKey: string, isSpinnerOn: boolean) => void
}
