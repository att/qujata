const testSuites = 'test_suites';
const prefix = 'qujata-api';

export const APIS: { [key in keyof typeof API_URLS]: string } = {
  analyze: `${prefix}/analyze`,
  algorithms: `${prefix}/algorithms`,
  iterations: `${prefix}/iterations`,
  testRunResults: `${prefix}/${testSuites}/:testSuiteId`,
  editExperiment: `${prefix}/${testSuites}/:testSuiteId`,
  deleteExperiment: `${prefix}/${testSuites}/:testSuiteId`,
};

enum API_URLS {
  analyze,
  algorithms,
  iterations,
  testRunResults,
  editExperiment,
  deleteExperiment,
}
