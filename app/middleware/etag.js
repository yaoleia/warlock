const etag = require('koa-etag');

module.exports = (options, app) => {
    return etag(options);
};
