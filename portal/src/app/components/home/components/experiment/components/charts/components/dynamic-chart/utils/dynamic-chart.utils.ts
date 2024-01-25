import { ChartType } from "../models/dynamic-chart.interface";
import LineSvg from '../../../../../../../../../../../src/assets/images/line.svg';
import BarSvg from '../../../../../../../../../../../src/assets/images/bar.svg';

export function getIconByValue(value: ChartType): string {
    return value === ChartType.LINE ? LineSvg : BarSvg;
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
