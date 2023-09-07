import { snakeCaseToCamelCase } from './snakeCaseToCamelCase';

describe('snakeCaseToCamelCase', () => {
  test('should convert snake case to camel case', () => {
    expect(snakeCaseToCamelCase('to_camel')).toBe('toCamel');
    expect(snakeCaseToCamelCase('to-camel')).toBe('toCamel');
  });

  test('should not convert snake case to camel case for upper cases', () => {
    expect(snakeCaseToCamelCase('TO-CAMEL')).toBe('TO-CAMEL');
    expect(snakeCaseToCamelCase('TO_CAMEL')).toBe('TO_CAMEL');
  });
});
