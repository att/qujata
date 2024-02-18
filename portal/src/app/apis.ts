const testSuites = 'test_suites';

export const APIS: { [key in keyof typeof API_URLS]: string } = {
  analyze: 'analyze',
  algorithms: 'algorithms',
  iterations: 'iterations',
  message_sizes: 'message_sizes',
  testRunResults: `${testSuites}/:testSuiteId`,
  editExperiment: `${testSuites}/:testSuiteId`,
  deleteExperiment: `${testSuites}/:testSuiteId`,
  allExperiments: `${testSuites}`,
  deleteExperiments: `${testSuites}/delete`,
};
 
enum API_URLS {
  analyze,
  algorithms,
  iterations,
  message_sizes,
  testRunResults,
  editExperiment,
  deleteExperiment,
  allExperiments,
  deleteExperiments
}
