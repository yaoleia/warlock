const httpProxy = require('http-proxy');
const URL = require('url-parse');

const proxy = httpProxy.createProxyServer();

proxy.on('proxyRes', (proxyRes, req, res) => {
  console.log(
    `Got response from proxy, url=${req.url}, code=${
      proxyRes.statusCode
    }, msg=${proxyRes.statusMessage}`
  );
});

async function proxyUrl(ctx, next) {
  const url = ctx.query.url;
  const urlObj = new URL(url);
  ctx.req.url = encodeURI(url);
  ctx.body = await _webAsync(ctx.req, ctx.res, {
    target: urlObj.origin
  });
  await next();
}

function _webAsync(req, res, opts) {
  console.log(`Proxying request ${req.url} to ${opts.target}`);
  return new Promise(resolve => {
    delete req.headers.host;
    proxy.web(req, res, opts, err => {
      if (err) {
        console.error(
          `Error occurred while proxying request ${req.url} to ${opts.target}`,
          err
        );
      }
      resolve(err);
    });
  });
}

exports.proxyUrl = proxyUrl;
