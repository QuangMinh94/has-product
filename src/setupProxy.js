const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api/task', {
      target: 'http://10.4.18.143:3000/api/task',
      changeOrigin: true,
      pathRewrite: { '^/api/task': '' }
    })
  );
  app.use(
    createProxyMiddleware('/api/users', {
      //target: 'http://10.4.18.104:5900/api/User',
      target: "http://10.4.18.143:3000/api/users",
      changeOrigin: true,
      pathRewrite: { '^/api/users': '' }
    })
  );
  app.use(
    createProxyMiddleware('/api/Template', {
      target: 'http://10.4.18.104:5900/api/Template',
      changeOrigin: true,
      pathRewrite: { '^/api/Template': '' }
    })
  );
  app.use(
    createProxyMiddleware('/api/Role', {
      target: 'http://10.4.18.104:5900/api/Role',
      changeOrigin: true,
      pathRewrite: { '^/api/Role': '' }
    })
  );
  app.use(
    createProxyMiddleware('/api/Transaction', {
      target: 'http://10.4.18.104:5900/api/Transaction',
      changeOrigin: true,
      pathRewrite: { '^/api/Transaction': '' }
    })
  );
  app.use(
    createProxyMiddleware('/api/gendoc/v1.1/UploadFiles', {
      target: 'http://10.4.18.107:5555/api/gendoc/v1.1/UploadFiles',
      changeOrigin: true,
      pathRewrite: { '^/api/gendoc/v1.1/UploadFiles': '' }
    })
  );
  app.use(
    createProxyMiddleware('/api/License', {
      target: 'http://10.4.18.104:5900/api/License',
      changeOrigin: true,
      pathRewrite: { '^/api/License': '' }
    })
  );

};