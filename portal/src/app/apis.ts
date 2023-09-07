export const APIS: { [key in keyof typeof API_URLS]: string } = {
  analyze: 'analyze',
  algorithms: 'algorithms',
};

enum API_URLS {
  analyze,
  algorithms,
}
