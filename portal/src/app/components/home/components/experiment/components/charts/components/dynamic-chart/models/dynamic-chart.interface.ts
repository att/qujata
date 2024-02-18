import { AttSelectOption } from "../../../../../../../../../shared/components/att-select";

export enum ChartType {
    LINE = 'line',
    BAR = 'bar',
}

export const chartTypeOptions: AttSelectOption[] = Object.keys(ChartType).map((key) => ({
    value: ChartType[key as keyof typeof ChartType],
    label: key,
}));

export enum XAxisType {
   NUMBER_OF_ITERATIONS = 'Number of Iterations',
}

export const xAxisTypeOptions: AttSelectOption[] = Object.keys(XAxisType).map((key) => ({
    value: key,
    label: XAxisType[key as keyof typeof XAxisType],
}));
