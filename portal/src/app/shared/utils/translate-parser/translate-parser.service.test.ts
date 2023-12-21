import { translateParserService as parser } from './translate-parser.service';

describe('TranslateParserService', (): void => {
  it('should not interpolate if no prams provided', (): void => {
    expect(parser.interpolateString('This is a {{ key }}')).toEqual('This is a {{ key }}');
  });

  it('should not interpolate if prams dont contains string key', (): void => {
    expect(parser.interpolateString('This is a {{ key }}', { test: 2 })).toEqual('This is a {{ key }}');
  });

  it('should interpolate strings', (): void => {
    expect(parser.interpolateString('This is a {{ key }}', { key: 'value' })).toEqual('This is a value');
  });

  it('should interpolate strings with number as param key', (): void => {
    expect(parser.interpolateString('This is a {{ 6 }}', { 6: 'value' })).toEqual('This is a value');
  });

  it('should interpolate strings with falsy values', (): void => {
    expect(parser.interpolateString('This is a {{ key }}', { key: '' })).toEqual('This is a ');
    expect(parser.interpolateString('This is a {{ key }}', { key: 0 })).toEqual('This is a 0');
  });

  it('should interpolate strings with object properties', (): void => {
    expect(parser.interpolateString('This is a {{ key1.key2 }}', { key1: { key2: 'value2' } })).toEqual('This is a value2');
    expect(parser.interpolateString('This is a {{ key1.key2.key3 }}', { key1: { key2: { key3: 'value3' } } })).toEqual('This is a value3');
  });
});
