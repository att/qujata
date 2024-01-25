import { AttSelectOption } from "../../../../../../../../../shared/components/att-select";

export enum ChartType {
    LINE = 'line',
    BAR = 'bar',
}

export const chartTypeOptions: AttSelectOption[] = Object.keys(ChartType).map((key) => ({
    value: ChartType[key as keyof typeof ChartType],
    label: key,
}));

enum XAxisType {
   NUMBER_OF_ITERATIONS = 'number of iterations',
}

export const xAxisTypeOptions: AttSelectOption[] = Object.keys(XAxisType).map((key) => ({
    value: XAxisType[key as keyof typeof XAxisType],
    label: key,
}));
