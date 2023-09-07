describe('environment', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('should add dynamic variables to environment object', async () => {
    window.PQC_PORTAL_ENV = { REACT_APP__BASE_API_URL: 'my test' };
    const { Environment } = await import('./environment');
    expect(Environment.baseApiUrl).toBe('my test');
  });


  test('should contain only static variables', async () => {
    const staticVariables = { PUBLIC_URL: 'static', NODE_ENV: process.env.NODE_ENV};
    process.env = staticVariables;
    const { Environment } = await import('./environment');
    expect(Environment.baseApiUrl).toBe('static');
    expect(Object.keys(Environment).length).toBe(1);
  });
});
