import { set, cloneDeep } from 'lodash';
import { IEnvironment } from './environment.interface';
import { snakeCaseToCamelCase } from '../app/utils/snakeCaseToCamelCase';
import { parseValue } from '../app/utils/parseValue';

const APPLICATION_VARIABLE_PREFIX: string = 'REACT_APP__';
const ENV_VARIABLE_NESTED_CHAR: string = '__';
const OBJECT_NESTED_CHAR: string = '.';

function getStaticVariables(): Record<string, string> {
  return Object.keys(process.env)
    .filter((key: string): boolean => key.startsWith(APPLICATION_VARIABLE_PREFIX))
    .reduce((obj: Record<string, string>, key: string) => {
      const value: string = process.env[key] as string;
      return { ...obj, [key]: value };
    }, {});
}

function getDynamicVariables(): Record<string, string> {
  const dynamicVariables: Record<string, string> = (window.PQC_PORTAL_ENV || {});
  delete window.PQC_PORTAL_ENV;
  return dynamicVariables;
}

function generateEnvironmentVariables(): IEnvironment {
  const mergedVariables: Record<string, string> = { ...getStaticVariables(), ...getDynamicVariables() };
  const env: Partial<IEnvironment> = {};

  Object.entries(mergedVariables).forEach(([key, value]: [string, string]) => {
    const path: string = key.replace(APPLICATION_VARIABLE_PREFIX, '')
      .toLocaleLowerCase()
      .split(ENV_VARIABLE_NESTED_CHAR).map(snakeCaseToCamelCase)
      .join(OBJECT_NESTED_CHAR);
    set(env, path, parseValue(value));
  });
  return env as IEnvironment;
}

export const Environment: IEnvironment = generateEnvironmentVariables();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
(window as any).PQC_PORTAL_ENV_VARS = cloneDeep(Environment);
