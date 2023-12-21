/* eslint-disable no-param-reassign */
import { isNil } from 'lodash';
import { TranslateParserParams } from './translate-parser.interface';

const OBJECT_SEPARATOR: string = '.';

class TranslateParserService {
  // eslint-disable-next-line @typescript-eslint/typedef
  templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

  interpolateString(expr: string, params?: TranslateParserParams): string {
    if (!params) {
      return expr;
    }

    return expr.replace(this.templateMatcher, (substring: string, b: string): string => {
      const r: string = this.getValue(params, b);
      return this.isDefined(r) ? r : substring;
    });
  }

  private getValue(target: TranslateParserParams, key: string): string {
    let result: TranslateParserParams | string = target;
    const keys: string[] = key.split(OBJECT_SEPARATOR);
    key = '';
    do {
      key += keys.shift();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (this.isDefined(result) && this.isDefined(result[key]) && (typeof result[key] === 'object' || !keys.length)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result = result[key] as TranslateParserParams;
        key = '';
      } else if (!keys.length) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result = undefined;
      } else {
        key += OBJECT_SEPARATOR;
      }
    } while (keys.length);

    return result as string;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line class-methods-use-this
  private isDefined(value: any): boolean {
    return !isNil(value);
  }
}

export const translateParserService: TranslateParserService = new TranslateParserService();
