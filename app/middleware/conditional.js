const conditional = require('koa-conditional-get');

module.exports = (options, app) => {
    return conditional(options);
};
