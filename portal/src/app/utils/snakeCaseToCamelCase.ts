function snakeToCamelGroupReplacer(group: string): string {
  return group.toUpperCase().replace('-', '').replace('_', '');
}

export function snakeCaseToCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, snakeToCamelGroupReplacer);
}
