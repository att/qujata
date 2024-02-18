const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  const target = process.env.REACT_SERVER_TARGET;
  if (!target) {
    return;
  }
  app.use(
    ['/analyze', '/algorithms', '/iterations', '/message_sizes', '/qujata-api', '/test_suites/*', '/test_suites'],
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: 'debug',
      secure: true,
    }),
  );
};
