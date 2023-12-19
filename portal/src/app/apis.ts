export const APIS: { [key in keyof typeof API_URLS]: string } = {
  analyze: 'analyze',
  algorithms: 'algorithms',
  iterations: 'iterations',
  testRunResults: 'experiment/:testSuiteId',
};

enum API_URLS {
  analyze,
  algorithms,
  iterations,
  testRunResults,
}
