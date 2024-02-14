import { getColorByName } from './charts.utils';

describe('Charts Util Test', () => {
  test('should get color by name', () => {
    expect(getColorByName('bikel1')).toBe('#FF8500');
  });
});
