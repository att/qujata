export default () => ({
    nginx: {
        host: process.env.NGINX_HOST || "nginx",
        port: process.env.NGINX_PORT || 4433
    },
    algorithms: (process.env.DEFAULT_GROUPS || "").split(':')
  });