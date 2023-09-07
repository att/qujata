/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @description
 * parseValue will receive a string value and try to convert it to his real type like:
 * 'true' will parse to true as boolean
 * '5' will parse to 5 as number
 * 'some text' will not parse and returned as 'some text'
 */
export function parseValue<T = unknown>(valueToParse: string): T {
  let value: T;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    value = JSON.parse(valueToParse);
  } catch {
    value = valueToParse as unknown as T;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value;
}
