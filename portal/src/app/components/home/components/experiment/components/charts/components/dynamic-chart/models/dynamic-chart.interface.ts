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

export enum YAxisType {
    AVERAGE_CPU = 'Average CPU',
    AVERAGE_MEMORY = 'Average Memory',
    BYTES_THROUGHPUT = 'Bytes Throughput',
    REQUEST_THROUGHPUT = 'Request Throughput',
}

export const xAxisTypeOptions: AttSelectOption[] = Object.keys(XAxisType).map((key) => ({
    value: key,
    label: XAxisType[key as keyof typeof XAxisType],
}));
