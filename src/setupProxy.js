const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  debugger;
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://lxjmu0r0r8.execute-api.us-west-2.amazonaws.com",
      changeOrigin: true,
    })
  );
  app.use(
    "/app_static",
    createProxyMiddleware({
      target: "https://lxjmu0r0r8.execute-api.us-west-2.amazonaws.com",
      changeOrigin: true,
    })
  );
  console.log("hi");
};
