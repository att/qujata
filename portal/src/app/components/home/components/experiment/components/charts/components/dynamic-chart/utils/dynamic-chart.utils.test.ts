import { ChartType } from '../models/dynamic-chart.interface';
import { capitalizeFirstLetter, getIconByValue, getTitleByXAxiosValue } from './dynamic-chart.utils';
import LineSvg from '../../../../../../../../../../../src/assets/images/line.svg';
import BarSvg from '../../../../../../../../../../../src/assets/images/bar.svg';

describe('Dynamic chart util test', () => {
  test('should get icon by value', () => {
    expect(getIconByValue(ChartType.LINE)).toBe(LineSvg);
    expect(getIconByValue(ChartType.BAR)).toBe(BarSvg);
  });

  test('should capitalize first letter', () => {
    expect(capitalizeFirstLetter('test')).toBe('Test');
  });

  test('should get title by XAxios value', () => {
    expect(getTitleByXAxiosValue('NUMBER_OF_ITERATIONS')).toBe('Iterations');
  });
});
