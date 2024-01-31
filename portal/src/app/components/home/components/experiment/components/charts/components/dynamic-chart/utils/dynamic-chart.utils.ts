import { ChartType } from "../models/dynamic-chart.interface";
import LineSvg from '../../../../../../../../../../../src/assets/images/line.svg';
import BarSvg from '../../../../../../../../../../../src/assets/images/bar.svg';
import { DYNAMIC_CHART_EN } from "../translate/en";

export function getIconByValue(value: ChartType): string {
    return value === ChartType.LINE ? LineSvg : BarSvg;
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getTitleByXAxiosValue(value: string): string {
    return value === 'NUMBER_OF_ITERATIONS' ? DYNAMIC_CHART_EN.X_VALUES_TITLE.ITERATIONS : '';
}
