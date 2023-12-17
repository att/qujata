/* eslint-disable no-param-reassign */
export function replaceParams(url: string, pathParams: Record<string, string | number | boolean | undefined>): string {
  Object.keys(pathParams).forEach((key: string): void => {
    url = url.replace(`:${key}`, pathParams[key] as string);
  });
  return url;
}
