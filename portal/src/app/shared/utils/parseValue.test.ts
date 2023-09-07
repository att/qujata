import { parseValue } from './parseValue';

describe('parseValue', () => {
  test('should parseValue string "true" to boolean type', () => {
    expect(parseValue('true')).toBe(true);
  });

  test('should parseValue number "5" to number type', () => {
    expect(parseValue('5')).toBe(5);
  });

  test('should parse string {"a": 5} to object', () => {
    expect(parseValue('{"a": 5}')).toEqual({ a: 5 });
  });

  test('should keep string as is', () => {
    expect(parseValue('some text')).toBe('some text');
  });
});
