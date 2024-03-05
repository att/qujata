import { getColorByName } from './charts.utils';

describe('getColorByName', () => {
  test('should get color by name', () => {
    const result = getColorByName('bikel1');
    expect(result).toBe('#FF8500');
  });

  test('should get the default color when the name does not start with a letter', () => {
    const result = getColorByName('123-test');
    expect(result).toBe('#086CE1');
  });
});
