const testSuites = 'test_suites';

export const APIS: { [key in keyof typeof API_URLS]: string } = {
  analyze: 'analyze',
  algorithms: 'algorithms',
  iterations: 'iterations',
  testRunResults: `${testSuites}/:testSuiteId`,
  editExperiment: `${testSuites}/:testSuiteId`,
  deleteExperiment: `${testSuites}/:testSuiteId`,
};

enum API_URLS {
  analyze,
  algorithms,
  iterations,
  testRunResults,
  editExperiment,
  deleteExperiment,
}
